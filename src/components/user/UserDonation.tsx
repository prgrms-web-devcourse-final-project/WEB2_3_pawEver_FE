// import { useState } from "react";
// import useritem_img from "../../assets/images/useritem_img.svg";
// import DonationModal from "./DonationModal";
// export default function UserDonation() {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   return (
//     <>
//       <button
//         className="flex w-full h-[180px] text-start"
//         onClick={() => setIsModalOpen(true)}
//       >
//         <img
//           src={useritem_img}
//           alt="사이드 이미지"
//           className="ml-4 w-10 h-full"
//         />
//         <div className="ml-4 mt-5">
//           <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
//             남기고 싶은 말: 좋은 곳에 사용해주시면
//             감사하겠습니다.감사하겠습니다.감사하겠습니다.
//           </div>
//           <div className="mt-14 md:mt-12 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
//             <p>후원금액 50,000원</p>
//             <p>후원날짜 2025.02.24</p>
//           </div>
//         </div>
//       </button>
//       {isModalOpen && (
//         <DonationModal
//           isModalOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </>
//   );
// }

//api바인딩

import { useState, useEffect } from "react";
import useritem_img from "../../assets/images/useritem_img.svg";
import DonationModal from "./DonationModal";
import useUserDonationStore, { Donation } from "../../store/userDonationStore";

export default function UserDonation() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );

  const { donations, isLoading, error, fetchDonations } =
    useUserDonationStore();

  useEffect(() => {
    fetchDonations();
  }, []);

  // 오류 상태 확인
  if (error) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-red-500 font-medium">
          후원 내역을 불러오는데 실패했습니다.
        </p>
        <p className="text-gray-500 text-sm mt-1">{error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => fetchDonations()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 로딩 상태 확인
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 데이터가 없는 경우 확인
  if (donations.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500 font-medium">후원 내역이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">
          아직 후원 내역이 없습니다. 동물들을 후원해 보세요!
        </p>
      </div>
    );
  }

  const handleDonationClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  return (
    <>
      {donations.map((donation) => (
        <button
          key={donation.donationId}
          className="flex w-full h-[180px] text-start mb-4 border-b pb-4"
          onClick={() => handleDonationClick(donation)}
        >
          <img
            src={useritem_img}
            alt="사이드 이미지"
            className="ml-4 w-10 h-full"
          />
          <div className="ml-4 mt-5">
            <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
              남기고 싶은 말: {donation.donorMessage || "메시지가 없습니다."}
            </div>
            <div className="mt-14 md:mt-12 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
              <p>후원금액 {donation.donationAmount.toLocaleString()}원</p>
              <p>후원날짜 {donation.createdAt}</p>
            </div>
          </div>
        </button>
      ))}

      {isModalOpen && selectedDonation && (
        <DonationModal
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          donation={selectedDonation}
        />
      )}
    </>
  );
}
