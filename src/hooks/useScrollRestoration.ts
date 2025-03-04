// useScrollRestoration.ts
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const location = useLocation();
  // 현재 라우트의 고유 key (pathname + 내부 해시 등)
  // 뒤로가기 시, 이 key가 바뀝니다.
  const currentKey = location.key;

  // 이전 라우트 key를 기억
  const previousKeyRef = useRef(currentKey);

  useEffect(() => {
    // 1) 떠나기 전 라우트의 스크롤 위치를 저장
    scrollPositions.set(previousKeyRef.current, window.scrollY);

    // 2) 새 라우트의 스크롤 위치 복원
    const storedY = scrollPositions.get(currentKey) ?? 0;
    window.scrollTo(0, storedY);

    // 3) 다음 이동 대비, 현재 라우트 key를 기록
    previousKeyRef.current = currentKey;
  }, [currentKey]);
}
