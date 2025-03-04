import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Lottie from "lottie-react";
import paw from "../../../assets/images/paw.json";
import logo from "../../../assets/icons/logo.svg";
import Button from "../../../common/ButtonComponent";

/**
 * @function DonationSuccess
 * @description
 * - /Donation/success 경로로 직접 접근 시 렌더되는 결제 성공 페이지
 * - URL 쿼리 파라미터로 받은 paymentKey, orderId, amount가 있다면 백엔드 결제 승인 로직을 실행할 수 있음.
 */
export default function DonationSuccess() {
  const location = useLocation();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    // 아직 승인 요청 안했고, 필요한 결제 정보가 있을 때만 승인 로직
    if (paymentKey && orderId && amount && !isConfirmed) {
      setIsConfirmed(true);
      // 추후에 post요청으로 url넘겨주면 됨.
    }
  }, [location, isConfirmed]);

  return (
    <div className="flex justify-center my-5">
      <div className="flex flex-col gap-4 justify-center items-center w-full max-w-[476px] min-h-[400px] border border-[#D9D9D9] rounded-3xl px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <img src={logo} alt="사이트 로고" className="w-6 h-6" />
          <p className="font-semibold text-[18px]">PAWEVER</p>
        </div>
        <p className="mb-4">후원해 주셔서 감사합니다</p>
        <Lottie animationData={paw} loop className="w-[100px] h-[100px] mb-4" />
        <Link to="/" className="w-full max-w-xs">
          <Button className="w-full h-12">확인</Button>
        </Link>
      </div>
    </div>
  );
}
