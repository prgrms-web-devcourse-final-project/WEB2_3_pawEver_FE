import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import ButtonComponent from "../../common/ButtonComponent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarM: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <button onClick={onClose} className="text-gray-600">
            ✖
          </button>
          <Link
            to="/"
            className="flex gap-2 justify-center items-center
          "
            onClick={onClose}
          >
            <img src={logo} alt="PAWEVER Logo" className="h-8 mx-auto" />
            <p className="font-bold text-sm"> PAWEVER </p>
          </Link>
        </div>
        <div className="p-6 text-center">
          <p className="font-semibold text-gray-700">
            어서오세요 <span className="text-main font-bold">우정완</span>님
          </p>
          <div className="w-24 h-24 mx-auto my-4 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
            <img src={logo} className="w-12 h-12" />
          </div>
        </div>
        <nav className="flex flex-col space-y-4 p-4">
          <Link
            to="/AnimalDetail/1"
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-700"
          >
            <span>🐾</span>
            <span>입양동물찾기</span>
          </Link>
          <Link
            to="/community"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <span>😄</span>
            <span>커뮤니티</span>
          </Link>
          <Link
            to="/EditReservation"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <span>📅</span>
            <span>예약상담</span>
          </Link>
          <Link
            to="/Donation"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <span>❤️</span>
            <span>Donation</span>
          </Link>
        </nav>
        <div className="p-4 mt-6">
          <ButtonComponent className="w-full">로그인</ButtonComponent>
        </div>
      </div>
    </>
  );
};

export default SidebarM;
