import React, { useState, useEffect } from "react";
import logo from "../../assets/icons/logo.svg";
import Input from "../../common/InputComponent";
import Button from "../../common/ButtonComponent";
import { useDonationStore } from "../../store/donationStore";
import toast from "react-hot-toast";

export default function Donation() {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    donationForm,
    updateDonationForm,
    initiateDonation,
    error,
    isLoading,
  } = useDonationStore();

  // 로컬 에러 상태 (폼 검증)
  const [localError, setLocalError] = useState<string | null>(null);

  // 결제 수단 선택
  const handleSelect = (value: "card" | "cash") => {
    updateDonationForm({
      paymentMethod: donationForm.paymentMethod === value ? null : value,
    });
  };

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    // 후원자 이름은 빈 값이어도 됨 (익명 처리)

    if (!donationForm.amount.trim()) {
      toast.error("후원할 금액을 입력해주세요.", { duration: 1500 });
      return false;
    }

    if (!donationForm.message.trim()) {
      toast.error("남길 메시지를 입력해주세요.", { duration: 1500 });
      return false;
    }

    if (!donationForm.paymentMethod) {
      toast.error("결제 방법을 선택해주세요.", { duration: 1500 });
      return false;
    }

    // 금액 숫자 변환
    const amountNum = parseInt(donationForm.amount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("정상적인 후원 금액을 입력해주세요.", { duration: 1500 });
      return false;
    }

    setLocalError(null);
    return true;
  };

  // 후원 시작
  const handleDonate = () => {
    if (validateForm()) {
      toast.promise(
        initiateDonation(),
        {
          loading: "결제창을 불러오는 중...",
          success: "결제창이 열렸습니다.",
          error: "결제창을 불러오는 중 오류가 발생했습니다.",
        },
        {
          duration: 1500, // 모든 토스트에 적용될 지속 시간
          success: {
            duration: 1500,
          },
          error: {
            duration: 1500,
          },
        }
      );
    }
  };

  // 스토어 에러 메시지 표시
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 1500 });
    }
  }, [error]);

  return (
    <div className="flex justify-center my-5">
      <div className="flex flex-col gap-4 justify-center items-center w-full max-w-[476px] h-[593px] border border-[#D9D9D9] rounded-3xl px-5">
        <div className="flex gap-1">
          <img src={logo} alt="사이트 로고" className="w-6 h-6" />
          <p className="font-semibold text-[18px]">PAWEVER</p>
        </div>
        <p className="font-semibold text-[16px] mb-5 text-center">
          후원금은 전액 동물보호센터에 후원되고 있습니다.
        </p>

        <div className="w-full space-y-4">
          {/* 후원자 이름 */}
          <div>
            <p className="text-[14px] text-[#5F656C]">
              후원자 이름(공백시 익명)
            </p>
            <Input
              placeholder="후원자 이름을 입력해주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
              value={donationForm.donorName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateDonationForm({ donorName: e.target.value })
              }
            />
          </div>

          {/* 후원 금액 */}
          <div>
            <p className="text-[14px] text-[#5F656C]">
              후원 금액 <span className="text-[#F7585C]">*</span>
            </p>
            <Input
              placeholder="후원할 금액을 입력해주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
              value={donationForm.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateDonationForm({ amount: e.target.value })
              }
            />
          </div>

          {/* 남기고 싶은 말 */}
          <div>
            <p className="text-[14px] text-[#5F656C]">
              남기고 싶은 말 <span className="text-[#F7585C]">*</span>
            </p>
            <Input
              placeholder="후원에 대한 메시지를 남겨주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
              value={donationForm.message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateDonationForm({ message: e.target.value })
              }
            />
          </div>
        </div>

        {/* 결제 방법 선택 */}
        <div className="w-full">
          <p className="text-[14px] text-[#5F656C]">
            결제 방법 <span className="text-[#F7585C]">*</span>
          </p>
          <div className="flex w-full gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                donationForm.paymentMethod === "card"
                  ? "bg-main text-white"
                  : "bg-[#F4F6F8] text-[#9da3ae]"
              }`}
              onClick={() => handleSelect("card")}
            >
              신용/체크카드
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                donationForm.paymentMethod === "cash"
                  ? "bg-main text-white"
                  : "bg-[#F4F6F8] text-[#9da3ae]"
              }`}
              onClick={() => handleSelect("cash")}
            >
              실시간계좌이체
            </button>
          </div>
        </div>

        {/* 후원하기 버튼 */}
        <Button
          className={`w-full h-[64px] mt-5 border-none ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={isLoading ? undefined : handleDonate}
        >
          {isLoading ? "처리 중..." : "후원하기"}
        </Button>
      </div>
    </div>
  );
}
