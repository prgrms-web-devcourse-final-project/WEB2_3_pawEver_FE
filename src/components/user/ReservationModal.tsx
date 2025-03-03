import React from "react";
import logo from "../../assets/icons/logo.svg";
import Button from "../../common/ButtonComponent";

interface ReservationModal {
  confirmText: string;
  onConfirm: () => void;
  children: React.ReactNode;
  cancelText: string;
  onCancel: () => void;
}
export default function ReservationModal({
  confirmText,
  onConfirm,
  children,
  cancelText,
  onCancel,
}: ReservationModal) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10 px-4">
      <div className="w-full max-w-sm sm:max-w-md h-auto bg-white rounded-3xl flex flex-col items-center justify-center px-4 py-8">
        <div className="flex gap-1 ">
          <img src={logo} alt="사이트로고" className="w-6 h-6" />
          <p className="font-semibold text-[18px]">PAWEVER</p>
        </div>
        {children}
        <div className="flex gap-2">
          <Button
            className="px-5"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            {confirmText}
          </Button>
          <Button
            className="px-5 bg-white border-main text-main hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
