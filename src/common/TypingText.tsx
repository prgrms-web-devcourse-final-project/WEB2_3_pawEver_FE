import { useState, useEffect } from "react";

/**
 * TypingTextProps
 * @property text              실제 표시할 문구
 * @property typingSpeed       글자를 한 개씩 찍어주는 간격 (ms). 기본값 80ms
 * @property onComplete        모든 글자 표시 완료 후 실행되는 콜백
 */
type TypingTextProps = {
  text: string;
  typingSpeed?: number;
  onComplete?: () => void;
};

/**
 * 타이핑 효과로 글자를 표시하는 컴포넌트
 */
export default function TypingText({
  text,
  typingSpeed = 80,
  onComplete,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      // 다음 글자까지 표시
      currentIndex++;
      setDisplayed(text.slice(0, currentIndex));

      // 마지막 글자까지 표시되었으면 종료
      if (currentIndex >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, typingSpeed);

    // 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [text, typingSpeed, onComplete]);

  return <span>{displayed}</span>;
}
