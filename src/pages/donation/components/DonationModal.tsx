import Lottie from "lottie-react";
import paw from "../../../assets/images/paw.json";
import logo from "../../../assets/icons/logo.svg";
import Button from "../../../common/ButtonComponent";
//
interface Modal {
  isModalOpen: boolean;
  closeModal: () => void;
}
export default function DonationModal({ isModalOpen, closeModal }: Modal) {
  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10 px-4">
        <div className="w-full max-w-sm sm:max-w-md h-[303px] bg-white rounded-3xl flex flex-col items-center justify-center px-4">
          <div className="flex gap-1 ">
            <img src={logo} alt="사이트로고" className="w-6 h-6" />
            <p className="font-semibold text-[18px]">PAWEVER</p>
          </div>
          <p>후원해 주셔서 감사합니다</p>
          <Lottie
            animationData={paw}
            loop={true}
            className="w-[100px] h-[100px]"
          />
          <Button className="w-full h-12 " onClick={closeModal}>
            확인
          </Button>
        </div>
      </div>
    )
  );
}
