import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authAxiosInstance from "../api/authAxiosInstance";
import axios from "axios";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken?: string; // RefreshToken은 쿠키
  introduction?: string;
}

//소셜 로그인 요청 페이로드
interface SocialLoginPayload {
  socialLoginUuid: string;
  name?: string;
  profileImageUrl?: string;
  email?: string;
  socialLoginProvider: string;
  latitude: number;
  longitude: number;
}

//서버 응답 바디: { isSuccess, status, code, ... }
interface AuthResponseBody {
  isSuccess: boolean;
  status: string;
  code: string;
  message?: string;
}

/* Zustand 상태 */
interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  isProfileUpdating: boolean;
  userInfo: UserInfo | null;
  error: string | null;
  processingCode: string | null;
  redirectPath: string;

  resetState: () => void;
  setLoading: (flag: boolean) => void;
  setError: (msg: string | null) => void;
  setRedirectPath: (path: string) => void;
  setProfileUpdating: (flag: boolean) => void;

  // 로그인/로그아웃
  login: (userData: UserInfo) => Promise<void>;
  logout: () => Promise<void>;

  // 소셜 로그인 시작
  googleLoginInit: () => void;
  kakaoLoginInit: () => void;

  // 소셜 콜백 처리
  handleOAuthCallback: () => Promise<void>;

  // 토큰 재발급
  refreshUserTokens: () => Promise<boolean>;

  // 프로필 업데이트
  updateUserInfo: (data: Partial<UserInfo>) => void;

  // DB에서 최신 사용자 정보 로드
  loadUserProfileFromDB: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isLoading: false,
      isProfileUpdating: false,
      userInfo: null,
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
        });
      },
      //소셜 로딩
      setProfileUpdating: (flag: boolean) => {
        set({ isProfileUpdating: flag });
      },
      setLoading: (flag) => set({ isLoading: flag }),
      setError: (msg) => set({ error: msg }),
      setRedirectPath: (path) => set({ redirectPath: path }),

      login: async (userData: UserInfo) => {
        console.log("[AuthStore] 로그인 처리:", userData);

        if (userData?.accessToken) {
          authAxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${userData.accessToken}`;
        }

        set({
          isLoggedIn: true,
          userInfo: userData,
          error: null,
        });
      },

      //로그아웃
      logout: async () => {
        console.log("[AuthStore] 로그아웃 처리");
        set({ isLoading: true });
        try {
          delete authAxiosInstance.defaults.headers.common["Authorization"];
          set({
            isLoggedIn: false,
            userInfo: null,
            isLoading: false,
            error: null,
            processingCode: null,
          });

          // 소셜로그인 세션 스토리지 정리
          sessionStorage.removeItem("googleOAuthState");
          sessionStorage.removeItem("kakaoOAuthState");
          sessionStorage.removeItem("loginProvider");

          console.log("[AuthStore] 로그아웃 완료");
        } catch (error) {
          console.error("[AuthStore] 로그아웃 중 오류:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "로그아웃 중 오류가 발생했습니다.",
            isLoading: false,
          });
        }
      },

      googleLoginInit: () => {
        const { isLoading, setLoading, setError } = get();
        if (isLoading) return;

        setLoading(true);
        setError(null);

        try {
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
          console.error("[AuthStore] 구글 로그인 초기화 오류:", err);
          set({
            error: "구글 로그인을 시작하는데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      kakaoLoginInit: () => {
        const { isLoading, setLoading, setError } = get();
        if (isLoading) return;

        setLoading(true);
        setError(null);

        try {
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
          console.error("[AuthStore] 카카오 로그인 초기화 오류:", err);
          set({
            error: "카카오 로그인을 시작하는데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      handleOAuthCallback: async () => {
        const { login, loadUserProfileFromDB, setProfileUpdating } = get();

        try {
          if (get().isLoggedIn) return;

          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          if (!code) return;

          // 같은 code로 중복처리 방지
          if (get().processingCode === code) {
            console.log("[AuthStore] 이미 처리 중인 인증 코드");
            return;
          }

          // 소셜 인증 콜백 전역 로딩 시작
          set({
            processingCode: code,
            isLoading: true,
            error: null,
            isProfileUpdating: false,
          });

          const state = urlParams.get("state");
          const errParam = urlParams.get("error");
          const provider = sessionStorage.getItem("loginProvider");

          if (errParam) {
            throw new Error(`로그인 오류: ${errParam}`);
          }
          if (!state || !provider) {
            cleanupUrlParams();
            set({
              isLoading: false,
              processingCode: null,
              isProfileUpdating: false,
            });
            return;
          }

          // 보안검증
          const savedState = sessionStorage.getItem(`${provider}OAuthState`);
          if (state !== savedState) {
            throw new Error("보안 검증 실패. 다시 시도해 주세요.");
          }

          // 소셜에서 사용자 기본 정보 획득
          let socialPayload: SocialLoginPayload;
          if (provider === "google") {
            const googleData = await fetchGoogleTokenAndUserData(code);
            socialPayload = {
              socialLoginUuid: googleData.userData.sub,
              name: googleData.userData.name,
              profileImageUrl: googleData.userData.picture,
              email: googleData.userData.email,
              socialLoginProvider: "google",
              latitude: 0,
              longitude: 0,
            };
          } else {
            // kakao
            const kakaoData = await fetchKakaoTokenAndUserData(code);
            socialPayload = {
              socialLoginUuid: kakaoData.userData.id.toString(),
              name: kakaoData.userData.properties?.nickname,
              profileImageUrl: kakaoData.userData.properties?.profile_image,
              email: kakaoData.userData.kakao_account?.email,
              socialLoginProvider: "kakao",
              latitude: 37.6336457,
              longitude: 126.7927116,
            };
          }

          // 백엔드 로그인 요청
          const { isSuccess, message, accessToken } = await requestBackendLogin(
            socialPayload
          );
          if (!isSuccess || !accessToken) {
            throw new Error(
              `백엔드 로그인 실패: ${message || "알 수 없는 오류"}`
            );
          }

          // 우선 소셜 정보를 기준으로 userInfo 구성
          const newUserInfo = {
            id: socialPayload.socialLoginUuid,
            name: socialPayload.name || "",
            email: socialPayload.email || "",
            picture: socialPayload.profileImageUrl,
            introduction: undefined, // DB에서 다시 불러올 예정
            accessToken,
          };

          // Zustand 로그인
          await login(newUserInfo);

          // ★ DB 프로필 로딩 구간만 별도 스피너 처리
          setProfileUpdating(true);
          console.log("[AuthStore] DB에서 추가 프로필 불러오기...");
          await loadUserProfileFromDB();
          setProfileUpdating(false);

          // 파라미터 정리
          cleanupUrlParams();
          sessionStorage.removeItem(`${provider}OAuthState`);
          sessionStorage.removeItem("loginProvider");

          // 최종 리다이렉트
          set({ processingCode: null });
          const redirectTo = get().redirectPath || "/";
          window.location.replace(redirectTo);
        } catch (err) {
          console.error("[AuthStore] handleOAuthCallback 오류:", err);
          cleanupUrlParams();
          set({
            error:
              err instanceof Error
                ? err.message
                : "로그인 처리 중 오류가 발생했습니다.",
            isLoading: false,
            isProfileUpdating: false,
            processingCode: null,
          });
        } finally {
          // 전체 소셜 로그인 프로세스 종료
          set({ isLoading: false, isProfileUpdating: false });
        }
      },

      loadUserProfileFromDB: async () => {
        try {
          const { userInfo, updateUserInfo } = get();
          if (!userInfo || !userInfo.accessToken) {
            console.warn("[AuthStore] 토큰이 없어 프로필 로드 불가");
            return false;
          }

          if (!authAxiosInstance.defaults.headers.common["Authorization"]) {
            authAxiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${userInfo.accessToken}`;
          }

          console.log("[AuthStore] 백엔드에서 프로필 정보 GET");
          const resp = await authAxiosInstance.get("/api/users/profiles");
          console.log("[AuthStore] 프로필 정보 응답:", resp.data);

          if (resp.status === 200 && resp.data && resp.data.isSuccess) {
            const profileData = resp.data.data;
            if (profileData) {
              updateUserInfo({
                name: profileData.name,
                email: profileData.email,
                picture: profileData.profileImageUrl,
                introduction: profileData.introduction,
              });
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error("[AuthStore] 프로필 로드 오류:", error);
          return false;
        }
      },

      refreshUserTokens: async (): Promise<boolean> => {
        try {
          const resp = await authAxiosInstance.post(
            "/api/auth/refreshedtokens",
            {},
            { withCredentials: true }
          );
          const newAccessToken = resp.headers.authorization?.replace(
            "Bearer ",
            ""
          );

          if (newAccessToken) {
            authAxiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            get().updateUserInfo({ accessToken: newAccessToken });

            // 갱신 후 DB프로필도 갱신
            await get().loadUserProfileFromDB();
            return true;
          }
          return false;
        } catch (err) {
          console.error("[AuthStore] 토큰 갱신 실패:", err);
          return false;
        }
      },

      updateUserInfo: (data) => {
        set((state) => {
          const merged = state.userInfo ? { ...state.userInfo, ...data } : null;
          return { userInfo: merged };
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      // accessToken은 저장하지 않고, 기본 프로필만 로컬스토리지에 보관
      partialize: (state) => {
        let safeUserInfo: UserInfo | null = null;
        if (state.userInfo) {
          const { accessToken, ...rest } = state.userInfo;
          safeUserInfo = { ...rest };
        }
        return {
          isLoggedIn: state.isLoggedIn,
          userInfo: safeUserInfo,
          redirectPath: state.redirectPath,
        };
      },
    }
  )
);

function cleanupUrlParams() {
  const url = new URL(window.location.href);
  ["code", "state", "error", "scope", "authuser", "prompt"].forEach((p) =>
    url.searchParams.delete(p)
  );
  window.history.replaceState({}, document.title, url.toString());
}

async function fetchGoogleTokenAndUserData(code: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";

  // 구글 토큰
  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      client_secret: clientSecret,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  if (!tokenRes.data.access_token) {
    throw new Error("구글 토큰 요청 실패");
  }

  // 유저정보
  const userRes = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
    }
  );

  return {
    userData: userRes.data, // { sub, name, email, picture, ... }
    accessToken: tokenRes.data.access_token,
  };
}

async function fetchKakaoTokenAndUserData(code: string) {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID || "";
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || "";

  // 카카오 토큰
  const tokenRes = await axios.post(
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

  if (!tokenRes.data.access_token) {
    throw new Error("카카오 토큰 요청 실패");
  }

  // 유저정보
  const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
  });

  return {
    userData: userRes.data,
    accessToken: tokenRes.data.access_token,
  };
}

/**
 * /api/auth/tokens 호출
 * - 응답 body는 { isSuccess, status, code, ... }
 * - 응답 헤더에 Authorization(AccessToken)
 */
async function requestBackendLogin(payload: SocialLoginPayload) {
  try {
    const resp = await authAxiosInstance.post<AuthResponseBody>(
      "/api/auth/tokens",
      payload,
      { withCredentials: true }
    );

    // 헤더에서 AccessToken 추출
    const newAccessToken = resp.headers.authorization?.replace("Bearer ", "");

    if (!newAccessToken) {
      return {
        isSuccess: false,
        message: "응답에 AccessToken이 없습니다.",
        accessToken: "",
      };
    }

    // body는 단순 { isSuccess, status, code } 구조
    const data = resp.data;
    return {
      isSuccess: data.isSuccess,
      status: data.status,
      code: data.code,
      message: data.message,
      accessToken: newAccessToken,
    };
  } catch (error) {
    console.error("[requestBackendLogin] 오류:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      const eData = error.response.data as any;
      return {
        isSuccess: false,
        message: eData?.message || "로그인 API 오류",
        accessToken: "",
      };
    }
    return {
      isSuccess: false,
      message:
        error instanceof Error
          ? error.message
          : "로그인 처리 중 알 수 없는 오류",
      accessToken: "",
    };
  }
}
