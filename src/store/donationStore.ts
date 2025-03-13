import { create } from "zustand";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useAuthStore } from "./authStore";
import authAxiosInstance from "../api/authAxiosInstance";

// Toss Payments 및 API 환경 변수
const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || "";
const BASE_URL = window.location.origin; // 현재 도메인 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// 타입 정의
interface DonationForm {
  donorName: string;
  amount: string;
  message: string;
  paymentMethod: "card" | "cash" | null;
}

interface DonationItem {
  id: string;
  donorName: string;
  amount: number;
  message: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

interface DonationStoreState {
  // 사용자 입력 폼
  donationForm: DonationForm;

  // 결제 및 후원 상태
  isLoading: boolean;
  error: string | null;

  // 후원 내역
  donations: DonationItem[];
  totalDonationAmount: number;

  // 현재 처리 중인 주문 정보
  currentOrderId: string | null;

  // 액션 - 폼 관리
  updateDonationForm: (form: Partial<DonationForm>) => void;
  resetDonationForm: () => void;

  // 액션 - 결제 프로세스 (3단계로 분리)
  initiateDonation: () => Promise<void>; // 후원 생성
  requestPayment: (
    orderId: string,
    paymentAmount: number,
    donationId: string
  ) => Promise<void>; //결제 요청
  confirmPayment: (
    paymentKey: string,
    orderId: string,
    paymentAmount: number
  ) => Promise<void>; // 결제 승인

  // 이전 호환성을 위한 통합 함수
  confirmDonation: (
    paymentKey: string,
    orderId: string,
    amount: string
  ) => Promise<void>;

  // 액션 - 후원 내역 조회
  fetchUserDonations: () => Promise<void>;
  fetchTotalDonationAmount: () => Promise<void>;
}

// 초기 상태
const initialDonationForm: DonationForm = {
  donorName: "",
  amount: "",
  message: "",
  paymentMethod: null,
};

// Zustand 스토어 생성
export const useDonationStore = create<DonationStoreState>((set, get) => ({
  // 상태
  donationForm: { ...initialDonationForm },
  isLoading: false,
  error: null,
  donations: [],
  totalDonationAmount: 0,
  currentOrderId: null,

  // 폼 업데이트 액션
  updateDonationForm: (form) => {
    set((state) => ({
      donationForm: { ...state.donationForm, ...form },
    }));
  },

  // 폼 초기화 액션
  resetDonationForm: () => {
    set(() => ({
      donationForm: { ...initialDonationForm },
    }));
  },

  // 후원 생성 액션
  initiateDonation: async () => {
    const { donationForm } = get();

    // 금액 숫자 변환 (이미 컴포넌트에서 검증하였지만 안전을 위해 다시 확인)
    const amountNum = parseInt(donationForm.amount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      set({ error: "정상적인 후원 금액을 입력해주세요." });
      return;
    }

    // 중복 요청 방지
    if (get().isLoading) {
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // 주문 ID 생성
      const orderId = `ORDER-${new Date().getTime()}`;
      let donationId;

      try {
        // 액세스 토큰 가져오기
        const { userInfo } = useAuthStore.getState();
        const accessToken = userInfo?.accessToken;

        if (!accessToken) {
          throw new Error("로그인이 필요한 서비스입니다.");
        }

        // 후원 정보 등록 API 호출
        const donationResponse = await authAxiosInstance.post(
          `${API_BASE_URL}/api/donations`,
          {
            donorName: donationForm.donorName,
            donorMessage: donationForm.message,
            donationAmount: amountNum,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("후원 등록 API 응답:", donationResponse.data);

        // 응답에서 donationId 추출
        if (donationResponse.data.isSuccess && donationResponse.data.data) {
          donationId = donationResponse.data.data;
          console.log("생성된 후원 ID:", donationId);
        } else {
          throw new Error("후원 정보 등록에 실패했습니다.");
        }

        // 현재 주문 ID 저장
        set({ currentOrderId: orderId });
      } catch (error: any) {
        console.error(
          "후원 등록 API 오류:",
          error.response?.data || error.message
        );
        throw new Error("후원 정보 등록에 실패했습니다.");
      }

      // Toss Payments SDK 로드
      const tossPayments = await loadTossPayments(CLIENT_KEY);

      // 결제창 호출
      await tossPayments.requestPayment(
        donationForm.paymentMethod === "card" ? "카드" : "계좌이체",
        {
          amount: amountNum,
          orderId,
          orderName: donationForm.message || "후원 결제",
          successUrl: `${BASE_URL}/donation/success?donationId=${donationId}`,
          failUrl: `${BASE_URL}/donation/fail`,
        }
      );
    } catch (error: any) {
      console.error(
        "결제 요청 중 오류:",
        error.response?.data || error.message
      );
      set({
        error: "결제 요청 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 결제 요청 액션
  requestPayment: async (orderId, paymentAmount, donationId) => {
    // 중복 요청 방지
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 액세스 토큰 가져오기
      const { userInfo } = useAuthStore.getState();
      const accessToken = userInfo?.accessToken;

      if (!accessToken) {
        throw new Error("로그인이 필요한 서비스입니다.");
      }

      console.log("결제 정보 등록 파라미터:", {
        orderId,
        paymentAmount,
        donationId,
      });

      // 백엔드 방식과 일치하도록 요청 구성 (쿼리 파라미터 사용)
      const paymentResponse = await authAxiosInstance.post(
        `${API_BASE_URL}/api/payments?orderId=${orderId}&paymentAmount=${paymentAmount}&donationId=${donationId}`,
        null, // 빈 요청 본문
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("결제 요청 성공:", paymentResponse.data);

      set({ isLoading: false });
      return paymentResponse.data;
    } catch (error: any) {
      console.error(
        "결제 요청 중 오류:",
        error.response?.data || error.message
      );
      set({
        error: "결제 요청 중 오류가 발생했습니다.",
        isLoading: false,
      });
      throw error;
    }
  },

  // 결제 승인
  confirmPayment: async (paymentKey, orderId, paymentAmount) => {
    // 중복 요청 방지
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 액세스 토큰 가져오기
      const { userInfo } = useAuthStore.getState();
      const accessToken = userInfo?.accessToken;

      if (!accessToken) {
        throw new Error("로그인이 필요한 서비스입니다.");
      }

      console.log("결제 승인 요청 파라미터:", {
        paymentKey,
        orderId,
        paymentAmount,
      });

      const confirmResponse = await authAxiosInstance.post(
        `${API_BASE_URL}/api/payments/confirm?paymentKey=${paymentKey}&orderId=${orderId}&paymentAmount=${paymentAmount}`,
        null, // 빈 요청 본문
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("결제 승인 성공:", confirmResponse.data);

      // 후원 완료 처리
      if (confirmResponse.data.success || confirmResponse.data.isSuccess) {
        await get().fetchUserDonations();
        await get().fetchTotalDonationAmount();
        get().resetDonationForm();
      }

      set({
        isLoading: false,
        currentOrderId: null,
      });

      return confirmResponse.data;
    } catch (error: any) {
      console.error(
        "결제 승인 중 오류:",
        error.response?.data || error.message
      );
      set({
        error: "결제 승인 중 오류가 발생했습니다.",
        isLoading: false,
      });
      throw error;
    }
  },

  confirmDonation: async (paymentKey, orderId, amount) => {
    try {
      const amountNum = parseInt(amount, 10);

      // URL에서 donationId 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const donationId = urlParams.get("donationId");

      if (!donationId) {
        throw new Error("후원 ID가 누락되었습니다.");
      }

      // 두 단계 순차적으로 호출
      await get().requestPayment(orderId, amountNum, donationId);
      return await get().confirmPayment(paymentKey, orderId, amountNum);
    } catch (error) {
      throw error;
    }
  },

  // 사용자 후원 내역 조회 액션
  fetchUserDonations: async () => {
    try {
      set({ isLoading: true, error: null });

      // 액세스 토큰 가져오기
      const { userInfo } = useAuthStore.getState();
      const accessToken = userInfo?.accessToken;

      if (!accessToken) {
        throw new Error("로그인이 필요한 서비스입니다.");
      }

      const response = await authAxiosInstance.get(
        `${API_BASE_URL}/api/users/donations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 304,
        }
      );

      set({
        donations: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error(
        "후원 내역 조회 중 오류:",
        error.response?.data || error.message
      );
      set({
        error: "후원 내역을 불러오는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 전체 후원 금액 조회 액션
  fetchTotalDonationAmount: async () => {
    try {
      // 액세스 토큰 가져오기
      const { userInfo } = useAuthStore.getState();
      const accessToken = userInfo?.accessToken;

      if (!accessToken) {
        throw new Error("로그인이 필요한 서비스입니다.");
      }

      const response = await authAxiosInstance.get(
        `${API_BASE_URL}/api/donations/amount`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      set({ totalDonationAmount: response.data.amount });
    } catch (error: any) {
      console.error(
        "전체 후원 금액 조회 중 오류:",
        error.response?.data || error.message
      );
    }
  },
}));
