import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  // 토큰 가져오기
  const token = useAuthStore.getState().userInfo?.accessToken;

  // 토큰이 있으면 요청 헤더에 추가
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});
