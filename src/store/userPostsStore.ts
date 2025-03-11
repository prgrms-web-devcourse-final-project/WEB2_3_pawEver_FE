import { create } from "zustand";
import { persist } from "zustand/middleware";
import authAxiosInstance from "../api/authAxiosInstance";

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface UserPostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchUserPosts: () => Promise<void>;
}

export const useUserPostsStore = create<UserPostsState>()(
  persist(
    (set) => ({
      posts: [],
      isLoading: false,
      error: null,

      fetchUserPosts: async () => {
        // 이미 로딩 중이면 중복 호출 방지
        if (useUserPostsStore.getState().isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const response = await authAxiosInstance.get(
            "/api/community/my-posts"
          );
          console.log("API 응답:", response.data);

          // API 응답 구조에 맞게 데이터 추출
          // {isSuccess: true, status: 'OK', code: 'SUCCESS_0', data: Array(3)}
          const postsData =
            response.data && response.data.data ? response.data.data : [];
          set({ posts: postsData, isLoading: false });
        } catch (error) {
          console.error("내 게시물 조회 실패:", error);
          set({
            error: "게시물을 불러오는데 실패했습니다.",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "user-posts-storage",
      // 필요한 상태만 저장 (함수는 저장하지 않음)
      partialize: (state) => ({ posts: state.posts }),
    }
  )
);
