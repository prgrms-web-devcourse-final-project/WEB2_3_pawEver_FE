import React, { useEffect } from "react";
import logo from "../../assets/icons/logo.svg";
import { useAuthStore } from "../../store/authStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    isLoading,
    error,
    isLoggedIn,
    userInfo,
    googleLoginInit,
    kakaoLoginInit,
    handleOAuthCallback,
  } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      handleOAuthCallback();
    }
  }, [isOpen, handleOAuthCallback]);

  // 모달 밖 영역 클릭 시 닫기
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackgroundClick}
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

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
            {error}
          </div>
        )}

        {/* 로그인 성공 여부 */}
        {isLoggedIn && userInfo && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
            환영합니다, {userInfo.name}님!
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3">
          {/* Google 로그인 버튼 */}
          <button
            onClick={googleLoginInit}
            disabled={isLoading}
            className="w-[380px] h-[48px] bg-white text-gray-700 py-2 rounded-md border border-solid hover:bg-gray-50 disabled:opacity-70 flex items-center justify-center"
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

          {/* Kakao 로그인 버튼 */}
          <button
            onClick={kakaoLoginInit}
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
