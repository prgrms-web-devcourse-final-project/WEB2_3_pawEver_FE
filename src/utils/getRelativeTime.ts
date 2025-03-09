// 수정 필요
export default function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) {
    return "방금 전";
  }

  const diffMinutes = Math.floor(diff / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `${diffWeeks}주 전`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}달 전`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}년 전`;
}
