// import React, { useState } from "react";
// import logo from "../../assets/icons/logo.svg";
// import Input from "../../common/InputComponent";
// import Button from "../../common/ButtonComponent";
// import { loadTossPayments } from "@tosspayments/payment-sdk";

// const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || "";

// export default function Donation() {
//   // 결제 수단.
//   const [selected, setSelected] = useState<"card" | "cash" | null>(null);

//   // 사용자 입력 정보
//   const [donorName, setDonorName] = useState("");
//   const [donationAmount, setDonationAmount] = useState("");
//   const [donationMsg, setDonationMsg] = useState("");

//   // 결제 수단 선택
//   const handleSelect = (value: "card" | "cash") => {
//     setSelected((prev) => (prev === value ? null : value));
//   };

//   // 입력값 검증
//   const validationInputs = (): string => {
//     if (!donorName.trim()) return "후원자 이름을 입력해주세요.";
//     if (!donationAmount.trim()) return "후원할 금액을 입력해주세요.";
//     if (!donationMsg.trim()) return "남길 메시지를 입력해주세요.";
//     if (!selected) return "결제 방법을 선택해주세요.";
//     return "";
//   };

//   /**
//    * @description
//    * TOSS 결제 API를 통해 후원(결제) 창을 호출하는 함수
//    * @returns void
//    */
//   const handleDonate = async () => {
//     const errorMsg = validationInputs();
//     if (errorMsg) {
//       return alert(errorMsg);
//     }

//     // 금액 숫자 변환
//     const amountNum = parseInt(donationAmount, 10);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       return alert("정상적인 후원 금액을 입력해주세요.");
//     }

//     // 임시 주문번호 생성
//     const orderId = "ORDER-" + new Date().getTime();

//     // 테스트용 BASE_URL (배포 시 .env 등에 설정)
//     const BASE_URL = `http://localhost:5175`;

//     try {
//       const tossPayments = await loadTossPayments(CLIENT_KEY);

//       // 결제 창 호출
//       await tossPayments.requestPayment(
//         selected === "card" ? "카드" : "계좌이체",
//         {
//           amount: amountNum,
//           orderId,
//           orderName: donationMsg || "후원 결제",
//           successUrl: `${BASE_URL}/Donation/success`,
//           failUrl: `${BASE_URL}/Donation/fail`,
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       alert("결제 요청 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <DonationPresenter
//       donorName={donorName}
//       donationAmount={donationAmount}
//       donationMsg={donationMsg}
//       setDonorName={setDonorName}
//       setDonationAmount={setDonationAmount}
//       setDonationMsg={setDonationMsg}
//       selected={selected}
//       handleSelect={handleSelect}
//       handleDonate={handleDonate}
//     />
//   );
// }

// interface DonationPresenterProps {
//   donorName: string;
//   setDonorName: React.Dispatch<React.SetStateAction<string>>;
//   donationAmount: string;
//   setDonationAmount: React.Dispatch<React.SetStateAction<string>>;
//   donationMsg: string;
//   setDonationMsg: React.Dispatch<React.SetStateAction<string>>;
//   selected: "card" | "cash" | null;
//   handleSelect: (value: "card" | "cash") => void;
//   handleDonate: () => Promise<void>;
// }

// /**
//  * DonationPresenter
//  * - 순수하게 UI 렌더링만 담당(Presenter)
//  */
// function DonationPresenter({
//   donorName,
//   setDonorName,
//   donationAmount,
//   setDonationAmount,
//   donationMsg,
//   setDonationMsg,
//   selected,
//   handleSelect,
//   handleDonate,
// }: DonationPresenterProps) {
//   return (
//     <div className="flex justify-center my-5">
//       <div className="flex flex-col gap-4 justify-center items-center w-full max-w-[476px] h-[593px] border border-[#D9D9D9] rounded-3xl px-5">
//         <div className="flex gap-1">
//           <img src={logo} alt="사이트 로고" className="w-6 h-6" />
//           <p className="font-semibold text-[18px]">PAWEVER</p>
//         </div>
//         <p className="font-semibold text-[16px] mb-5 text-center">
//           후원금은 전액 동물보호센터에 후원되고 있습니다.
//         </p>

//         <div className="w-full space-y-4">
//           {/* 후원자 이름 */}
//           <div>
//             <p className="text-[14px] text-[#5F656C]">
//               후원자 이름(공백시 익명) <span className="text-[#F7585C]">*</span>
//             </p>
//             <Input
//               placeholder="후원자 이름을 입력해주세요."
//               className="h-[40px] bg-[#F4F6F8] border-none w-full"
//               value={donorName}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setDonorName(e.target.value)
//               }
//             />
//           </div>

//           {/* 후원 금액 */}
//           <div>
//             <p className="text-[14px] text-[#5F656C]">
//               후원 금액 <span className="text-[#F7585C]">*</span>
//             </p>
//             <Input
//               placeholder="후원할 금액을 입력해주세요."
//               className="h-[40px] bg-[#F4F6F8] border-none w-full"
//               value={donationAmount}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setDonationAmount(e.target.value)
//               }
//             />
//           </div>

//           {/* 남기고 싶은 말 */}
//           <div>
//             <p className="text-[14px] text-[#5F656C]">
//               남기고 싶은 말 <span className="text-[#F7585C]">*</span>
//             </p>
//             <Input
//               placeholder="후원에 대한 메시지를 남겨주세요."
//               className="h-[40px] bg-[#F4F6F8] border-none w-full"
//               value={donationMsg}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setDonationMsg(e.target.value)
//               }
//             />
//           </div>
//         </div>

//         {/* 결제 방법 선택 */}
//         <div className="w-full">
//           <p className="text-[14px] text-[#5F656C]">
//             결제 방법 <span className="text-[#F7585C]">*</span>
//           </p>
//           <div className="flex w-[424px] gap-2">
//             <button
//               className={`px-4 py-2 rounded-lg ${
//                 selected === "card"
//                   ? "bg-main text-white"
//                   : "bg-[#F4F6F8] text-[#9da3ae]"
//               }`}
//               onClick={() => handleSelect("card")}
//             >
//               신용/체크카드
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg ${
//                 selected === "cash"
//                   ? "bg-main text-white"
//                   : "bg-[#F4F6F8] text-[#9da3ae]"
//               }`}
//               onClick={() => handleSelect("cash")}
//             >
//               실시간계좌이체
//             </button>
//           </div>
//         </div>

//         {/* 후원하기 버튼 */}
//         <Button
//           className="w-full h-[64px] mt-5 border-none"
//           onClick={handleDonate}
//         >
//           후원하기
//         </Button>
//       </div>
//     </div>
//   );
// }

//test

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
