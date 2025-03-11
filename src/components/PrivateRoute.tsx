// PrivateRoute.tsx
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

// 전역 변수: PrivateRoute 모듈 내에서 토스트가 활성 상태인지 추적
let toastActive = false;

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn && !toastActive) {
      toastActive = true;
      toast.error("로그인이 필요합니다.", {
        position: "top-center",
        duration: 1500,
      });
      setTimeout(() => {
        toastActive = false;
      }, 1500);
    }
  }, [isLoggedIn, location]);

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
