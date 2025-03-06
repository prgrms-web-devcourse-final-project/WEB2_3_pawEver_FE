import React, { useState, useEffect } from "react";
import logo from "../../assets/icons/logo.svg";
import { useAuthStore } from "../../store/authStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userData: any) => void;
  onOpenModal: () => void;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenModal,
}) => {
  // Zustand 스토어 사용
  const { isLoading, error, login, setLoading, setError } = useAuthStore();
  const [loginStatus, setLoginStatus] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [config, setConfig] = useState({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    KAKAO_CLIENT_ID: "",
    REDIRECT_URI: "",
    API_BASE_URL: "",
    HOME_URL: "",
  });

  useEffect(() => {
    // 초기화 작업은 한 번만 실행되도록 함
    if (isOpen) {
      // 모달이 열릴 때만 초기화
      try {
        const newConfig = {
          GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
          GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "",
          KAKAO_CLIENT_ID: import.meta.env.VITE_KAKAO_CLIENT_ID || "",
          REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || "",
          API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
          HOME_URL: import.meta.env.VITE_HOME_URL || "/",
        };

        setConfig(newConfig);
      } catch (err) {
        setError("환경 변수를 불러오는데 실패했습니다.");
        console.error("환경 변수 로드 실패:", err);
      }
    }

    // ESC 키 이벤트 리스너 추가 (기존 코드 유지)
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose, setError]);

  // 로그인 콜백 체크를 위한 별도의 useEffect
  useEffect(() => {
    // 페이지 로드 시 한 번만 실행
    checkLoginCallback();
  }, []);

  const checkLoginCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    const loginProvider = sessionStorage.getItem("loginProvider");

    // 로그인 파라미터가 있으면 모달을 열기
    if ((code && state && loginProvider) || error) {
      // 모달이 닫혀 있으면 열기
      if (!isOpen) {
        onOpenModal();
      }

      if (code && state && loginProvider) {
        setLoginStatus("로그인 처리 중입니다...");
        setLoading(true);
        const savedState = sessionStorage.getItem(`${loginProvider}OAuthState`);

        if (state !== savedState) {
          setError("보안 검증에 실패했습니다. 다시 시도해주세요.");
          setLoading(false);
          // URL 파라미터 정리
          cleanupUrlParams();
          return;
        }

        try {
          let userData: UserInfo | null = null;

          if (loginProvider === "google") {
            userData = await handleGoogleLogin(code);
          } else if (loginProvider === "kakao") {
            userData = await handleKakaoLogin(code);
          }

          if (userData) {
            setUserInfo(userData);
            setLoginStatus("로그인이 완료되었습니다!");

            cleanupLoginParams(loginProvider);

            handleLoginSuccess(userData);
          }
        } catch (err) {
          console.error("로그인 프로세스 오류:", err);
          setError(
            `로그인 처리 중 오류가 발생했습니다: ${
              err instanceof Error ? err.message : "알 수 없는 오류"
            }`
          );
          setLoading(false);
          // 오류 발생 시에도 URL 파라미터 정리
          cleanupUrlParams();
        }
      } else if (error) {
        setError(`로그인 중 오류가 발생했습니다: ${error}`);
        setLoading(false);
        cleanupUrlParams();
      }
    }
  };

  // URL 파라미터 정리 함수 추가
  const cleanupUrlParams = () => {
    const url = new URL(window.location.href);
    // 로그인 관련 파라미터 모두 제거
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("error");
    url.searchParams.delete("scope");
    url.searchParams.delete("authuser");
    url.searchParams.delete("prompt");
    // 히스토리 변경
    window.history.replaceState({}, document.title, url.toString());
  };

  // Google 로그인 초기화 함수
  const googleLogin = () => {
    if (isLoading) return;

    try {
      setLoading(true);
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("googleOAuthState", state);
      sessionStorage.setItem("loginProvider", "google");

      // 환경 변수 직접 접근
      const currentClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
      const currentRedirectUri = import.meta.env.VITE_REDIRECT_URI || "";

      // Google 인증 URL로 리다이렉트
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${currentClientId}&redirect_uri=${encodeURIComponent(
        currentRedirectUri
      )}&response_type=code&scope=email%20profile&state=${state}`;

      window.location.href = googleAuthUrl;
    } catch (err) {
      console.error("구글 로그인 초기화 오류:", err);
      setError("구글 로그인을 시작하는데 실패했습니다.");
      setLoading(false);
    }
  };

  // Kakao 로그인 초기화 함수
  const kakaoLogin = () => {
    if (isLoading) return;

    try {
      setLoading(true);
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("kakaoOAuthState", state);
      sessionStorage.setItem("loginProvider", "kakao");

      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${
        config.KAKAO_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        config.REDIRECT_URI
      )}&response_type=code&state=${state}`;

      window.location.href = kakaoAuthUrl;
    } catch (err) {
      console.error("카카오 로그인 초기화 오류:", err);
      setError("카카오 로그인을 시작하는데 실패했습니다.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (code: string): Promise<UserInfo | null> => {
    try {
      // 환경 변수 직접 사용
      const currentClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
      const currentClientSecret =
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "";
      const currentRedirectUri = import.meta.env.VITE_REDIRECT_URI || "";

      const tokenResponse = await fetch(`https://oauth2.googleapis.com/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: currentClientId,
          redirect_uri: currentRedirectUri,
          code: code,
          client_secret: currentClientSecret,
        }),
      });

      // response를 JSON으로 한 번만 파싱
      let tokenData;
      try {
        tokenData = await tokenResponse.json();
      } catch (e) {
        throw new Error(`구글 토큰 요청 실패: ${await tokenResponse.text()}`);
      }

      if (!tokenResponse.ok) {
        throw new Error(`구글 토큰 요청 실패: ${JSON.stringify(tokenData)}`);
      }

      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );

      if (!userResponse.ok) throw new Error("구글 사용자 정보 요청 실패");

      const googleUserData = await userResponse.json();
      const userInfo: UserInfo = {
        id: googleUserData.sub,
        name: googleUserData.name,
        email: googleUserData.email,
        picture: googleUserData.picture,
      };

      // 백엔드에 데이터 전달하여 JWT 요청
      const jwtData = await requestJwtFromBackend(userInfo, "google");

      return jwtData ? userInfo : null;
    } catch (error) {
      console.error("구글 로그인 처리 중 오류:", error);
      throw error; // 오류를 다시 throw하여 상위 함수에서 처리할 수 있도록 함
    }
  };

  const handleKakaoLogin = async (code: string): Promise<UserInfo | null> => {
    try {
      // 최신 환경 설정값을 직접 사용
      const currentClientId = import.meta.env.VITE_KAKAO_CLIENT_ID || "";
      const currentRedirectUri = import.meta.env.VITE_REDIRECT_URI || "";

      // 카카오 토큰 요청
      const tokenResponse = await fetch(`https://kauth.kakao.com/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: currentClientId,
          redirect_uri: currentRedirectUri,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error("카카오 토큰 응답:", errorData);
        throw new Error(`카카오 토큰 요청 실패: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userResponse.ok) throw new Error("카카오 사용자 정보 요청 실패");

      const kakaoUserData = await userResponse.json();
      const userInfo: UserInfo = {
        id: kakaoUserData.id.toString(),
        name: kakaoUserData.properties?.nickname || "카카오 사용자",
        email: kakaoUserData.kakao_account?.email || generateTemporaryEmail(),
        picture: kakaoUserData.properties?.profile_image || undefined,
      };

      // 백엔드에 데이터 전달하여 JWT 요청
      const jwtData = await requestJwtFromBackend(userInfo, "kakao");

      return jwtData ? userInfo : null;
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류:", error);
      return null;
    }
  };

  const generateTemporaryEmail = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    return `${randomId}@temporary.com`;
  };

  const cleanupLoginParams = (loginProvider: string) => {
    cleanupUrlParams();

    sessionStorage.removeItem(`${loginProvider}OAuthState`);
    sessionStorage.removeItem("loginProvider");
  };

  const handleLoginSuccess = (userData: UserInfo) => {
    login(userData);

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }

    setTimeout(() => {
      onClose();
      if (window.location.pathname !== config.HOME_URL) {
        window.location.href = config.HOME_URL;
      }
    }, 1000);
  };

  const requestJwtFromBackend = async (
    userData: UserInfo,
    provider: string
  ) => {
    try {
      // 실제 백엔드 API 호출로 대체
      const response = await fetch(`${config.API_BASE_URL}/api/auth/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키가 있는 경우 포함
        body: JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: provider,
        }),
      });

      if (!response.ok) {
        throw new Error("JWT 토큰 요청 실패");
      }

      const data = await response.json();
      console.log("🔹 로그인 응답:", data); // 응답 확인 (개발 환경에서만 사용)

      // JWT 토큰 저장
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      return { success: false };
    } catch (error) {
      console.error("JWT 요청 처리 중 오류:", error);
      return { success: false };
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-lg w-[476px] min-h-[438px] flex flex-col justify-between p-10">
        <div className="text-center">
          <p className="flex items-center justify-center mb-8 text-[18px] font-semibold">
            <img src={logo} alt="logo" className="pr-2" />
            PAWEVER
          </p>
          <p className="text-[28px] font-bold mb-4">로그인</p>
          <p className="text-[24px] text-gray-500 mb-4 font-semibold leading-[1.2]">
            작은 발자국이
            <br />
            영원한 가족을 만듭니다
          </p>
          <p className="text-md text-gray-500 mb-9">
            PAWEVER에 로그인하고 가족을 찾아보세요!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
            {error}
          </div>
        )}

        {loginStatus && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded text-sm flex items-center justify-center">
            <span className="mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            {loginStatus}
          </div>
        )}

        {userInfo && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
            환영합니다, {userInfo.name}님!
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={googleLogin}
            disabled={isLoading}
            className="w-[380px] h-[48px] bg-white text-gray-700 py-2 rounded-md border border-solid hover:bg-gray-50 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google 로그인
          </button>

          <button
            onClick={kakaoLogin}
            disabled={isLoading}
            className="w-[380px] h-[48px] bg-yellow-400 text-black py-2 rounded-md hover:bg-yellow-500 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C7.03 3 3 6.37 3 10.5C3 13.39 4.92 15.93 7.76 17.22L6.76 21.33C6.67 21.67 7.08 21.94 7.37 21.74L12 18.86C16.97 18.86 21 15.49 21 10.5C21 6.37 16.97 3 12 3Z"
                  fill="black"
                />
              </svg>
            )}
            Kakao 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
