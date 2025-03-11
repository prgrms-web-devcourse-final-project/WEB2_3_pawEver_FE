import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDonationStore } from "../../../store/donationStore";
import Lottie from "lottie-react";
import paw from "../../../assets/images/paw.json";
import logo from "../../../assets/icons/logo.svg";
import Button from "../../../common/ButtonComponent";

export default function DonationSuccess() {
  const location = useLocation();
  const { confirmDonation, isLoading } = useDonationStore();
  const [confirmStatus, setConfirmStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [message, setMessage] = useState("후원 처리 중입니다...");
  const hasConfirmedRef = useRef(false); // 중복 호출 방지를 위한 ref

  useEffect(() => {
    // 이미 처리된 결제는 다시 처리하지 않음
    if (hasConfirmedRef.current) {
      console.log("이미 결제 승인 요청을 보냈습니다. 중복 요청 방지.");
      return;
    }

    const processPayment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const paymentAmount = searchParams.get("amount");
        const donationId = searchParams.get("donationId");

        // 필요한 결제 정보가 모두 있을 때만 승인 로직 실행
        if (paymentKey && orderId && paymentAmount && donationId) {
          console.log("결제 승인 요청:", {
            paymentKey,
            orderId,
            paymentAmount,
            donationId,
          });

          // 중복 호출 방지 플래그 설정
          hasConfirmedRef.current = true;

          // 결제 승인 API 호출
          await confirmDonation(paymentKey, orderId, paymentAmount);

          setConfirmStatus("success");
          setMessage("후원이 성공적으로 완료되었습니다.");
        } else {
          throw new Error("필수 결제 정보가 누락되었습니다.");
        }
      } catch (err) {
        console.error("결제 승인 실패:", err);
        setConfirmStatus("error");
        setMessage(
          "결제 승인 중 오류가 발생했습니다. 관리자에게 문의해주세요."
        );
      }
    };

    // 아직 처리되지 않은 상태이고 로딩 중이 아닐 때만 결제 처리 시도
    if (confirmStatus === "pending" && !isLoading && !hasConfirmedRef.current) {
      processPayment();
    }
  }, [location, confirmStatus, confirmDonation, isLoading]);

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
