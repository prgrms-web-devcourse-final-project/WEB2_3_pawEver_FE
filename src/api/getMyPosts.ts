import authAxiosInstance from "./authAxiosInstance";

// 게시글(Post) 데이터 구조 예시
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  // 필요하다면 필드 추가
}

export default async function getMyPosts(): Promise<Post[]> {
  const response = await authAxiosInstance.get("/api/community/my-posts");
  // 서버 응답 형태가 { data: Post[] } 라면 아래처럼 .data.data 할 수도 있음 으아아아아
  // 예: return response.data.data;
  return response.data;
}
