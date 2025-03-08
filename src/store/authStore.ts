//URL 정리 및 중복호출 방지 테스트
/**
 * 전역 인증 상태와 OAuth 로그인/로그아웃 로직을 관리하는 AuthStore
 * @return {AuthState} 인증 상태(isLoggedIn, userInfo, isLoading, error)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authAxiosInstance from "../api/authAxiosInstance";
import axios from "axios";
import { requestJwtFromBackend, JwtRequestPayload } from "../api/auth";

/* UserInfo - 서버/클라이언트에서 공통으로 사용될 유저 정보 타입 */
interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken?: string;
  introduction?: string;
}

/* AuthState : 로그인 상태 및 관련 액션 정의 */
interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  processingCode: string | null;
  redirectPath: string;

  /* 전역 액션들 */
  resetState: () => void;
  setLoading: (flag: boolean) => void;
  setError: (msg: string | null) => void;
  setRedirectPath: (path: string) => void;
  login: (userData: UserInfo) => void;
  logout: () => Promise<void>;

  /* OAuth 로그인 시작 (구글/카카오) */
  googleLoginInit: () => void;
  kakaoLoginInit: () => void;

  /*
   * OAuth 콜백 처리
   *  URL 파라미터(code, state 등) 확인
   *  에러 메시지 또는 정상 토큰 발급
   *  최종적으로 this.login()으로 Zustand 상태 업데이트
   */
  handleOAuthCallback: () => Promise<void>;

  // 프로필 업데이트 등으로 userInfo의 일부를 갱신할 수 있는 액션
  updateUserInfo: (data: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userInfo: null,
      isLoading: false,
      error: null,
      processingCode: null,
      redirectPath: "/",

      resetState: () => {
        set({
          isLoggedIn: false,
          userInfo: null,
          isLoading: false,
          error: null,
          processingCode: null,
          // redirectPath는 리셋하지 않음
        });
      },

      setLoading: (flag) => {
        set({ isLoading: flag });
      },

      setError: (msg) => {
        set({ error: msg });
      },

      // 리다이렉트 경로 설정
      setRedirectPath: (path) => {
        set({ redirectPath: path });
      },

      login: (userData) => {
        set({
          isLoggedIn: true,
          userInfo: userData,
          error: null,
        });
      },

      /* 로그아웃 */
      logout: async () => {
        try {
          set({ isLoading: true });
          // AccessToken은 axiosInstance의 인터셉터 혹은 헤더에 직접 설정됨
          const response = await authAxiosInstance.delete("/api/auth/tokens", {
            withCredentials: true,
          });

          if (response.status !== 204 && response.status !== 200) {
            console.warn("로그아웃 API 응답이 예상과 다릅니다:", response.data);
          }

          // 상태 초기화
          set({
            isLoggedIn: false,
            userInfo: null,
            isLoading: false,
            error: null,
            processingCode: null,
            // redirectPath는 유지
          });
          localStorage.removeItem("auth-storage");
        } catch (error) {
          console.error("로그아웃 처리 중 오류:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "로그아웃 중 오류가 발생했습니다",
            isLoading: false,
          });
        }
      },

      /* 구글 로그인 시작, OAuth URL로 리다이렉트 */
      googleLoginInit: () => {
        const { setLoading, setError } = get();
        try {
          if (get().isLoading) return;
          setLoading(true);
          setError(null);

          const state = Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem("googleOAuthState", state);
          sessionStorage.setItem("loginProvider", "google");

          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
          const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";
          const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&response_type=code&scope=email%20profile&state=${state}`;

          window.location.href = googleAuthUrl;
        } catch (err) {
          console.error("구글 로그인 초기화 오류:", err);
          set({
            error: "구글 로그인을 시작하는데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      /* 카카오 로그인 시작, OAuth URL로 리다이렉트 */
      kakaoLoginInit: () => {
        const { setLoading, setError } = get();
        try {
          if (get().isLoading) return;
          setLoading(true);
          setError(null);

          const state = Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem("kakaoOAuthState", state);
          sessionStorage.setItem("loginProvider", "kakao");

          const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID || "";
          const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";
          const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
          )}&response_type=code&state=${state}`;

          window.location.href = kakaoAuthUrl;
        } catch (err) {
          console.error("카카오 로그인 초기화 오류:", err);
          set({
            error: "카카오 로그인을 시작하는데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      //로그인 상태 Callback 함수
      handleOAuthCallback: async () => {
        const { setLoading, setError, login } = get();
        try {
          // 이미 로그인된 경우
          if (get().isLoggedIn) {
            return;
          }

          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");

          // 코드가 없으면 처리 중단
          if (!code) {
            return;
          }

          // 중요: 이미 처리 중인 코드인지 확인 (중복 호출 방지)
          if (get().processingCode === code) {
            console.log("이 인증 코드는 이미 처리 중입니다");
            return;
          }

          // 코드 처리 시작을 표시
          set({ processingCode: code });

          setLoading(true);
          setError(null);

          const state = urlParams.get("state");
          const errParam = urlParams.get("error");
          const provider = sessionStorage.getItem("loginProvider");

          // 에러 파라미터가 있으면 즉시 throw
          if (errParam) {
            throw new Error(`로그인 중 오류가 발생했습니다: ${errParam}`);
          }

          // state, provider 중 하나라도 없으면 처리 중단
          if (!state || !provider) {
            // URL 파라미터는 항상 정리
            cleanupUrlParams();
            set({
              isLoading: false,
              processingCode: null, // 중요: 처리 중 상태 해제
            });
            return;
          }

          // state 매칭 (보안검증)
          const savedState = sessionStorage.getItem(`${provider}OAuthState`);
          if (state !== savedState) {
            throw new Error("보안 검증에 실패했습니다. 다시 시도해주세요.");
          }

          let newUserInfo: UserInfo | null = null;

          // 각 SNS별로 토큰/유저정보 요청
          if (provider === "google") {
            newUserInfo = await fetchGoogleUserInfo(code);
          } else if (provider === "kakao") {
            newUserInfo = await fetchKakaoUserInfo(code);
          }

          // 받아온 유저 정보가 null이면 에러
          if (!newUserInfo) {
            throw new Error(
              "로그인 처리 중 문제가 발생했습니다. (newUserInfo null)"
            );
          }

          // 최종적으로 Zustand 로그인 처리
          login(newUserInfo);

          // URL 파라미터 정리 - 성공 시 항상 실행
          cleanupUrlParams();

          // 세션 스토리지 정리
          sessionStorage.removeItem(`${provider}OAuthState`);
          sessionStorage.removeItem("loginProvider");

          // 처리 중 상태 해제
          set({ processingCode: null });

          // 리다이렉트 경로로 이동
          const redirectTo = get().redirectPath || "/";
          window.location.replace(redirectTo);
        } catch (err) {
          console.error("handleOAuthCallback 오류:", err);

          // 에러 발생 시에도 URL 파라미터 정리
          cleanupUrlParams();

          set({
            error:
              err instanceof Error
                ? err.message
                : "로그인 처리 중 오류가 발생했습니다.",
            isLoading: false,
            processingCode: null, // 중요: 에러 발생 시에도 처리 중 상태 해제
          });
        }
      },

      // 추가: userInfo 업데이트 액션
      updateUserInfo: (data: Partial<UserInfo>) => {
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...data } : null,
        }));
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
        redirectPath: state.redirectPath, // 추가: 리다이렉트 경로 저장
      }),
    }
  )
);

/* URL 파라미터 정리 */
function cleanupUrlParams() {
  const url = new URL(window.location.href);
  ["code", "state", "error", "scope", "authuser", "prompt"].forEach((p) =>
    url.searchParams.delete(p)
  );
  window.history.replaceState({}, document.title, url.toString());
}

//위치정보 받아오기 전
/* 구글 사용자 정보 호출*/
async function fetchGoogleUserInfo(code: string): Promise<UserInfo | null> {
  try {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";

    // 구글 토큰 요청
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        client_secret: clientSecret,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const tokenData = tokenResponse.data;
    if (!tokenData.access_token) {
      throw new Error(`구글 토큰 요청 실패: ${JSON.stringify(tokenData)}`);
    }

    //  사용자 정보 요청
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );
    if (userResponse.status !== 200) {
      throw new Error("구글 사용자 정보 요청 실패");
    }
    const googleUserData = userResponse.data;

    //  백엔드로 JWT 요청
    const payload: JwtRequestPayload = {
      socialLoginUuid: googleUserData.sub,
      name: googleUserData.name,
      profileImageUrl: googleUserData.picture || "",
      email: googleUserData.email,
      socialLoginProvider: "google",
      latitude: "0",
      longitude: "0",
    };
    const jwtData = await requestJwtFromBackend(payload);
    if (!jwtData.isSuccess) return null;

    return {
      id: googleUserData.sub,
      name: googleUserData.name,
      email: googleUserData.email,
      picture: googleUserData.picture,
      accessToken: jwtData.accessToken,
    };
  } catch (err) {
    console.error("fetchGoogleUserInfo 오류:", err);
    return null;
  }
}

/* 카카오 사용자 정보 호출 */
async function fetchKakaoUserInfo(code: string): Promise<UserInfo | null> {
  try {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID || "";
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";

    //  카카오 토큰 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    const tokenData = tokenResponse.data;
    if (!tokenData.access_token) {
      throw new Error(`카카오 토큰 요청 실패: ${JSON.stringify(tokenData)}`);
    }

    // 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (userResponse.status !== 200) {
      throw new Error("카카오 사용자 정보 요청 실패");
    }

    const kakaoUserData = userResponse.data;

    // UserInfo 객체 생성
    const user: UserInfo = {
      id: kakaoUserData.id.toString(),
      name: kakaoUserData.properties?.nickname || "카카오 사용자",
      email: kakaoUserData.kakao_account?.email || "",
      picture: kakaoUserData.properties?.profile_image || "",
    };

    // 백엔드로 JWT 요청
    const payload: JwtRequestPayload = {
      socialLoginUuid: user.id,
      name: user.name,
      profileImageUrl: user.picture || "",
      email: user.email,
      socialLoginProvider: "kakao",
      latitude: "37.6336457",
      longitude: "126.7927116",
    };
    const jwtData = await requestJwtFromBackend(payload);
    if (!jwtData.isSuccess) return null;
    user.accessToken = jwtData.accessToken;
    return user;
  } catch (err) {
    console.error("fetchKakaoUserInfo 오류:", err);
    return null;
  }
}
