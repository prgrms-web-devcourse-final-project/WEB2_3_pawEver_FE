import logo from "../../assets/icons/logo.svg";
import Button from "../../common/ButtonComponent";
import { Donation } from "../../store/userDonationStore";

interface DonationModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  donation: Donation; // 후원 데이터 prop 추가
}

export default function DonationModal({
  isModalOpen,
  onClose,
  donation, // 후원 데이터 받기
}: DonationModalProps) {
  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10 px-4">
        <div className="w-full max-w-sm sm:max-w-md h-auto bg-white rounded-3xl flex flex-col items-center justify-center px-4 py-8">
          <div className="flex gap-1 ">
            <img src={logo} alt="사이트로고" className="w-6 h-6" />
            <p className="font-semibold text-[18px]">PAWEVER</p>
          </div>
          <div className="self-start space-y-3 my-8 mx-9">
            <div>
              <p className="text-[14px] text-[#5F656C]">후원자</p>
              <p className="font-semibold text-[16px]">
                {donation.donorName || "익명"}
              </p>
            </div>

            <div>
              <p className="text-[14px] text-[#5F656C]">후원금액</p>
              <p className="font-semibold text-[16px]">
                {donation.donationAmount.toLocaleString()}원
              </p>
            </div>

            <div>
              <p className="text-[14px] text-[#5F656C]">남기고 싶은 말</p>
              <p className="font-semibold text-[16px]">
                {donation.donorMessage || "메시지가 없습니다."}
              </p>
            </div>
          </div>
          <Button className="w-[70px] h-12 " onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    )
  );
}
