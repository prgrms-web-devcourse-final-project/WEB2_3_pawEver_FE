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
export default function TypingText({ text, typingSpeed, onComplete, }: TypingTextProps): import("react/jsx-runtime").JSX.Element;
export {};
