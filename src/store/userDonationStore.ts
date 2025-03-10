import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

// 후원 내역 데이터 타입 정의
export interface Donation {
  userId: string;
  donationId: number;
  donorName: string;
  donorMessage: string;
  donationAmount: number;
  createdAt: string;
  paymentStatus: string | null;
}

// 스토어 상태 인터페이스
interface DonationState {
  donations: Donation[];
  isLoading: boolean;
  error: Error | null;

  fetchDonations: () => Promise<void>;
  resetError: () => void;
}

// 스토어 생성
const useUserDonationStore = create<DonationState>((set) => ({
  donations: [],
  isLoading: false,
  error: null,

  fetchDonations: async () => {
    try {
      set({ isLoading: true, error: null });

      // authStore에서 액세스 토큰 가져오기
      const accessToken = useAuthStore.getState().userInfo?.accessToken;

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
      }

      // API 요청
      const response = await axios.get("/api/users/donations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // 응답 데이터 확인
      if (!response.data.isSuccess) {
        throw new Error(`API 오류: ${response.data.code}`);
      }

      // paymentStatus가 null이 아닌 항목만 필터링
      const filteredDonations = response.data.data.filter(
        (donation: Donation) => donation.paymentStatus !== null
      );

      set({
        donations: filteredDonations,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "후원 내역을 불러오는 중 오류가 발생했습니다.";

      set({
        error: new Error(errorMessage),
        isLoading: false,
      });
    }
  },

  resetError: () => set({ error: null }),
}));

export default useUserDonationStore;
