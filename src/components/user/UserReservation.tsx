import { useState } from "react";
import useritem_img from "../../assets/images/useritem_img.svg";
import cancel from "../../assets/icons/cancel.svg";
import ReservationModal from "./ReservationModal";
import { useLocation } from "react-router-dom";

export default function UserReservation() {
  const { pathname } = useLocation();
  const isUserPage = pathname.includes("Userpage");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const modalProps = isUserPage
    ? {
        confirmText: "확인",
        onConfirm: () => setIsDetailModalOpen(false),
        cancelText: "예약취소",
        onCancel: () => {
          console.log("예약취소코드");
          setIsDetailModalOpen(false);
        },
      }
    : {
        confirmText: "수락",
        onConfirm: () => {
          console.log("예약 수락코드");
          setIsDetailModalOpen(false);
        },
        cancelText: "거절",
        onCancel: () => {
          console.log("예약거절코드");
          setIsDetailModalOpen(false);
        },
      };
  return (
    <>
      <button
        className="relative flex w-full h-[180px]"
        onClick={() => {
          setIsDetailModalOpen(true);
        }}
      >
        <img
          src={useritem_img}
          alt="사이드 이미지"
          className="ml-4 w-10 h-full"
        />
        <div className="ml-4 mt-5 text-start">
          <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
            남기고 싶은 말: 좋은 곳에 사용해주시면
            감사하겠습니다.감사하겠습니다.감사하겠습니다.
          </div>

          <div className="mt-7 md:mt-5 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
            <p>보호기관 포켓멍센터</p>
            <p>예약일시 2025.02.24 오후 2시 </p>
          </div>
          <div className="flex gap-2 font-semibold text-[12px] text-white mt-2">
            <div className="flex w-10 h-5 bg-main rounded-lg items-center justify-center">
              봉사
            </div>
            <div className="flex w-[75px] h-5 bg-[#FB9404] rounded-lg items-center justify-center">
              예약접수중
            </div>
          </div>
        </div>
        {isUserPage && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCancelModalOpen(true);
            }}
          >
            <img
              src={cancel}
              alt="예약취소"
              className="absolute top-6 right-4 w-7 h-7 "
            />
          </button>
        )}
        {isCancelModalOpen && (
          <ReservationModal
            confirmText="확인"
            onConfirm={() => {
              setIsCancelModalOpen(false);
            }}
            cancelText="예약취소"
            onCancel={() => {
              console.log("예약취소");
              setIsCancelModalOpen(false);
            }}
          >
            <p className="my-8">예약을 취소하시겠습니까?</p>
          </ReservationModal>
        )}
      </button>
      {isDetailModalOpen && (
        <ReservationModal {...modalProps}>
          <div className="self-start text-start space-y-3 my-8 ml-10">
            <div>
              <p className="text-[14px] text-[#5F656C]">제목</p>
              <p className="font-semibold text-[16px]">
                포메라니안 입양하고 싶습니다
              </p>
            </div>
            <div>
              <p className="text-[14px] text-[#5F656C]">예약 유형</p>
              <p className="font-semibold text-[16px]">상담</p>
            </div>
            <div>
              <p className="text-[14px] text-[#5F656C]">예약자</p>
              <p className="font-semibold text-[16px]">홍길동</p>
            </div>
            <div>
              <p className="text-[14px] text-[#5F656C]">예약자 번호</p>
              <p className="font-semibold text-[16px]">010-4544-5646</p>
            </div>
            <div>
              <p className="text-[14px] text-[#5F656C]">예약 일시</p>
              <p className="font-semibold text-[16px]">2025.02.28 오후 2시</p>
            </div>
            <div>
              <p className="text-[14px] text-[#5F656C]">보호기관</p>
              <p className="font-semibold text-[16px]">포켓멍센터</p>
            </div>
          </div>
        </ReservationModal>
      )}
    </>
  );
}
