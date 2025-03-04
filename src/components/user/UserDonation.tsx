import { useState } from "react";
import useritem_img from "../../assets/images/useritem_img.svg";
import DonationModal from "./DonationModal";
export default function UserDonation() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="flex w-full h-[180px] text-start"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={useritem_img}
          alt="사이드 이미지"
          className="ml-4 w-10 h-full"
        />
        <div className="ml-4 mt-5">
          <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
            남기고 싶은 말: 좋은 곳에 사용해주시면
            감사하겠습니다.감사하겠습니다.감사하겠습니다.
          </div>
          <div className="mt-14 md:mt-12 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
            <p>후원금액 50,000원</p>
            <p>후원날짜 2025.02.24</p>
          </div>
        </div>
      </button>
      {isModalOpen && (
        <DonationModal
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
