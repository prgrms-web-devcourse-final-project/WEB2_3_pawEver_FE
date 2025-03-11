export default function formatDate(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();

  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const diff = Math.floor((now.getTime() - kstDate.getTime()) / 1000);

  if (diff < 0) return "1초 전";
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  return `${kstDate.getFullYear()}.${String(kstDate.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(kstDate.getDate()).padStart(2, "0")}`;
}
