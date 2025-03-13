// PrivateRoute.tsx
import { ReactNode, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

// 중복 토스트 발생을 막기 위한 플래그
let toastActive = false;

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn, justLoggedOut, setJustLoggedOut } = useAuthStore();
  const location = useLocation();

  // 이전의 로그인 상태를 저장하여, 변경이 있을 때만 토스트를 띄우도록 함
  const prevIsLoggedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    // 최초 렌더링 시 상태 초기화
    if (prevIsLoggedInRef.current === null) {
      prevIsLoggedInRef.current = isLoggedIn;
      return;
    }

    // 로그아웃 직후 상태 처리
    if (justLoggedOut) {
      // 로그아웃 직후에는 토스트를 표시하지 않고 상태만 리셋
      setTimeout(() => {
        setJustLoggedOut(false);
      }, 100);
      return;
    }

    // 로그인되지 않은 상태에서 인증 페이지 접근 시 토스트 표시
    if (!isLoggedIn && !toastActive && !justLoggedOut) {
      toastActive = true;
      toast.error("로그인이 필요합니다.", {
        position: "top-center",
        duration: 1500,
      });

      setTimeout(() => {
        toastActive = false;
      }, 1500);
    }

    // 로그인 상태 업데이트
    prevIsLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn, justLoggedOut, setJustLoggedOut, location]);

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
