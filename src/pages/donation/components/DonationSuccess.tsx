import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDonationStore } from "../../../store/donationStore";
import { useAuthStore } from "../../../store/authStore";
import Lottie from "lottie-react";
import paw from "../../../assets/images/paw.json";
import logo from "../../../assets/icons/logo.svg";
import Button from "../../../common/ButtonComponent";

export default function DonationSuccess() {
  const location = useLocation();
  const { confirmDonation } = useDonationStore();
  const { userInfo, refreshUserTokens } = useAuthStore();
  const [confirmStatus, setConfirmStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [message, setMessage] = useState("후원 처리 중입니다...");
  const processingRef = useRef(false); // 처리 중 상태 관리
  const retryCountRef = useRef(0); // 재시도 횟수 관리
  const MAX_RETRIES = 2; // 최대 재시도 횟수

  useEffect(() => {
    // 페이지 로드 시 한 번만 실행
    if (!processingRef.current) {
      processPayment();
    }

    return () => {
      // 컴포넌트 언마운트 시 상태 정리
      processingRef.current = false;
    };
  }, []);

  const processPayment = async () => {
    // 이미 처리 중이면 중복 실행 방지
    if (processingRef.current) {
      console.log("이미 결제 처리 중입니다.");
      return;
    }

    // 처리 시작 플래그 설정
    processingRef.current = true;

    try {
      // 결제 정보 추출
      const searchParams = new URLSearchParams(location.search);
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const paymentAmount = searchParams.get("amount");
      const donationId = searchParams.get("donationId");

      // 필요한 결제 정보 검증
      if (!paymentKey || !orderId || !paymentAmount || !donationId) {
        throw new Error("필수 결제 정보가 누락되었습니다.");
      }

      console.log("결제 정보 확인:", {
        paymentKey,
        orderId,
        paymentAmount,
        donationId,
      });

      // 토큰 유효성 먼저 확인
      await ensureValidToken();

      // 결제 승인 API 호출
      console.log("결제 승인 요청 시작");
      await confirmDonation(paymentKey, orderId, paymentAmount);

      // 성공 처리
      setConfirmStatus("success");
      setMessage("후원이 성공적으로 완료되었습니다.");
    } catch (err: any) {
      console.error("결제 승인 처리 중 오류:", err);

      // 401 에러인 경우 토큰 재발급 후 재시도
      if (
        err?.response?.status === 401 &&
        retryCountRef.current < MAX_RETRIES
      ) {
        retryCountRef.current += 1;
        console.log(
          `토큰 만료로 재시도 (${retryCountRef.current}/${MAX_RETRIES})`
        );

        try {
          const refreshed = await refreshUserTokens();
          if (refreshed) {
            // 처리 플래그 초기화하고 재시도
            processingRef.current = false;
            return processPayment();
          }
        } catch (refreshErr) {
          console.error("토큰 재발급 실패:", refreshErr);
        }
      }

      // 최종 실패 처리
      setConfirmStatus("error");
      setMessage("결제 승인 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
    } finally {
      // 이미 성공했거나 최대 재시도 횟수를 초과한 경우에만 처리 완료로 표시
      if (confirmStatus === "success" || retryCountRef.current >= MAX_RETRIES) {
        processingRef.current = false;
      }
    }
  };

  // 유효한 토큰 확보 함수
  const ensureValidToken = async () => {
    // 토큰이 없거나 만료된 경우 재발급
    if (!userInfo?.accessToken) {
      console.log("액세스 토큰 없음, 재발급 시도");
      const tokenRefreshed = await refreshUserTokens();

      if (!tokenRefreshed) {
        throw new Error("세션이 만료되었습니다. 다시 로그인 해주세요.");
      }

      console.log("토큰 재발급 성공");
    } else {
      console.log("유효한 액세스 토큰 있음");
    }
  };

  return (
    <div className="flex justify-center my-5">
      <div className="flex flex-col gap-4 justify-center items-center w-full max-w-[476px] min-h-[400px] border border-[#D9D9D9] rounded-3xl px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <img src={logo} alt="사이트 로고" className="w-6 h-6" />
          <p className="font-semibold text-[18px]">PAWEVER</p>
        </div>

        {confirmStatus === "pending" && (
          <>
            <p className="mb-4">{message}</p>
            <Lottie
              animationData={paw}
              loop={true}
              className="w-[100px] h-[100px] mb-4"
            />
          </>
        )}

        {confirmStatus === "success" && (
          <>
            <p className="mb-4">후원해 주셔서 감사합니다</p>
            <Lottie
              animationData={paw}
              loop
              className="w-[100px] h-[100px] mb-4"
            />
          </>
        )}

        {confirmStatus === "error" && (
          <>
            <p className="mb-4 text-red-500">{message}</p>
            <p className="text-sm text-gray-600 mb-4">
              오류가 지속되면 고객센터로 문의해주세요.
            </p>
          </>
        )}

        <Link to="/" className="w-full max-w-xs">
          <Button className="w-full h-12">확인</Button>
        </Link>
      </div>
    </div>
  );
}
