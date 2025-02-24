import React, { useState } from "react";
import logo from "../../assets/icons/logo.svg";
import Input from "../../common/InputComponent";
import Button from "../../common/ButtonComponent";
import DonationModal from "./components/DonationModal";

export default function Donation() {
  const [selected, setSelected] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelect = (value: string) => {
    setSelected((prev) => (prev === value ? null : value));
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          <div>
            <p className="text-[14px] text-[#5F656C]">
              후원자 이름(공백시 익명) <span className="text-[#F7585C]">*</span>
            </p>
            <Input
              placeholder="후원자 이름을 입력해주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
            />
          </div>

          <div>
            <p className="text-[14px] text-[#5F656C]">
              후원 금액 <span className="text-[#F7585C]">*</span>
            </p>
            <Input
              placeholder="후원할 금액을 입력해주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
            />
          </div>

          <div>
            <p className="text-[14px] text-[#5F656C]">
              남기고 싶은 말 <span className="text-[#F7585C]">*</span>
            </p>
            <Input
              placeholder="후원에 대한 메시지를 남겨주세요."
              className="h-[40px] bg-[#F4F6F8] border-none w-full"
            />
          </div>
        </div>

        <div className="w-full">
          <p className="text-[14px] text-[#5F656C]">
            결제 방법 <span className="text-[#F7585C]">*</span>
          </p>
          <div className="flex w-[424px] gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                selected === "card"
                  ? "bg-main text-white"
                  : "bg-[#F4F6F8]  text-[#9da3ae]"
              }`}
              onClick={() => handleSelect("card")}
            >
              신용/체크카드
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                selected === "cash"
                  ? "bg-main text-white"
                  : "bg-[#F4F6F8]  text-[#9da3ae]"
              }`}
              onClick={() => handleSelect("cash")}
            >
              실시간계좌이체
            </button>
          </div>
        </div>

        <Button
          className="w-full h-[64px] mt-5 border-none"
          onClick={openModal}
        >
          후원하기
        </Button>
        <DonationModal isModalOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </div>
  );
}
