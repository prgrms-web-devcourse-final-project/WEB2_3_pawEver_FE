import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const pathKey = location.pathname;

  // 브라우저 기본 스크롤 복원 비활성화
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // 스크롤 위치 저장
  useEffect(() => {
    // handleScroll 함수가 실제로 사용되도록 함
    const handleScroll = () => {
      sessionStorage.setItem(pathKey, window.scrollY.toString());
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      // 기존 인라인 코드 대신 handleScroll 호출
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathKey]);

  // 스크롤 복원
  useLayoutEffect(() => {
    const restoreScroll = () => {
      if (navigationType === "POP") {
        const storedY = Number(sessionStorage.getItem(pathKey)) || 0;
        console.log(`Restoring scroll to ${storedY} for ${pathKey}`);
        window.scrollTo({
          top: storedY,
          behavior: "auto",
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    // timer를 변수에 할당 후, 복원 함수 호출
    const timer = setTimeout(restoreScroll, 0);
    return () => clearTimeout(timer);
  }, [pathKey, navigationType]);
}
