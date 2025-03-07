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
    // Cleanup: 컴포넌트 언마운트 시 기본값 복원
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // 스크롤 위치 저장
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(pathKey, window.scrollY.toString());
    };

    // 디바운싱 적용
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(pathKey, window.scrollY.toString());
      }, 100);
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
        console.log(`Restoring scroll to ${storedY} for ${pathKey}`); // 디버깅
        window.scrollTo({
          top: storedY,
          behavior: "auto",
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    // 무한 스크롤 데이터 로드 대기 (필요 시 조정)
    const timer = setTimeout(restoreScroll, 0);
  }, [pathKey, navigationType]);
}
