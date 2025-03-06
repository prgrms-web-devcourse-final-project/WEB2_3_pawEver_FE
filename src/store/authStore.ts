import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLoggedIn: (status: boolean) => void;
  setUserInfo: (user: UserInfo | null) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  login: (userData: UserInfo) => void;
  logout: () => Promise<boolean>;
  resetState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userInfo: null,
      isLoading: false,
      error: null,

      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setUserInfo: (user) => set({ userInfo: user }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),

      resetState: () =>
        set({
          isLoading: false,
          error: null,
        }),

      login: (userData) => {
        set({
          isLoggedIn: true,
          userInfo: userData,
          error: null,
        });
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

          // 로그 출력 (보내는 데이터 확인)
          console.log("🚀 Logging out...");
          console.log("🔹 API URL:", `${API_BASE_URL}/api/auth/tokens`);

          const response = await fetch(`${API_BASE_URL}/api/auth/tokens`, {
            method: "DELETE",
            credentials: "include", // 쿠키 포함
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("🔹 Response Status:", response.status);
          console.log("🔹 Response Headers:", response.headers);

          const responseData = await response.json();
          console.log("🔹 Response Body:", responseData);

          if (!response.ok) {
            console.warn("🚨 로그아웃 API 호출 실패:", responseData);
          }

          // 로컬 상태 초기화
          set({
            isLoggedIn: false,
            userInfo: null,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error("🚨 로그아웃 처리 중 오류:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "로그아웃 중 오류가 발생했습니다",
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
      }),
    }
  )
);
