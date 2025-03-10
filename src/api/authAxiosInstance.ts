// import axios, { AxiosError, AxiosInstance } from "axios";
// import { useAuthStore } from "../store/authStore";

// // refresh 요청 중복 방지용
// let isRefreshing = false;
// let refreshCallQueue: Array<() => void> = [];

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const authAxiosInstance: AxiosInstance = axios.create({
//   baseURL,
//   withCredentials: true, // HttpOnly 쿠키 사용
// });

// // 응답 인터셉터
// authAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // 401이면 액세스 토큰 만료 등 인증 문제로 간주
//       const originalRequest = error.config;

//       // 이미 다른 요청이 refresh 중이면, refreshCallQueue에 요청을 잠시 대기
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           refreshCallQueue.push(() => {
//             if (!originalRequest) return reject(error);
//             authAxiosInstance
//               .request(originalRequest)
//               .then(resolve)
//               .catch(reject);
//           });
//         });
//       }
//       // 아니면 refresh 진행
//       isRefreshing = true;
//       try {
//         // refresh 요청
//         await authAxiosInstance.post("/api/auth/refreshedtokens");
//         // refresh 성공하면 대기 중인 요청들 재시도
//         refreshCallQueue.forEach((cb) => cb());
//         refreshCallQueue = [];
//         if (originalRequest) {
//           return authAxiosInstance.request(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh 실패:", refreshError);
//         // refresh 실패 시 로그아웃
//         useAuthStore.getState().logout();
//         refreshCallQueue.forEach((cb) => cb());
//         refreshCallQueue = [];
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default authAxiosInstance;

//final

import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";

// refresh 요청 중복 방지 플래그
let isRefreshing = false;
let refreshCallQueue: Array<() => void> = [];

const baseURL = import.meta.env.VITE_API_BASE_URL;

const authAxiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // HttpOnly 쿠키 사용
});

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // 이미 다른 요청이 refresh 중이면, 큐에 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshCallQueue.push(() => {
            if (!originalRequest) return reject(error);
            authAxiosInstance
              .request(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // 직접 리프레시 진행
      isRefreshing = true;
      try {
        const refreshResponse = await authAxiosInstance.post(
          "/api/auth/refreshedtokens"
        );
        // 성공 시, 새 Access Token은 응답 헤더
        const newAccessToken = refreshResponse.headers.authorization?.replace(
          "Bearer ",
          ""
        );

        if (newAccessToken) {
          authAxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          useAuthStore
            .getState()
            .updateUserInfo({ accessToken: newAccessToken });
        }

        // 대기 중이던 요청들 재시도
        refreshCallQueue.forEach((cb) => cb());
        refreshCallQueue = [];

        if (originalRequest) {
          return authAxiosInstance.request(originalRequest);
        }
      } catch (e) {
        console.error("[authAxiosInstance] Token refresh 실패:", e);
        // refresh 실패 → 강제 로그아웃
        useAuthStore.getState().logout();

        refreshCallQueue.forEach((cb) => cb());
        refreshCallQueue = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default authAxiosInstance;
