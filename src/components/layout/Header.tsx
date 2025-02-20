import React, { useState } from "react";
import SidebarM from "./SidebarM";
import { Link } from "react-router-dom";
import ButtonComponent from "../../common/ButtonComponent";
import logo from "../../assets/icons/logo.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggined, setIsLoggined] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleQuickLogin = () => {
    setIsLoggined(true);
  };

  const handleLogout = () => {
    setIsLoggined(false);
  };
  const handleIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 flex items-center justify-between p-4 md:px-[5rem] shadow-md bg-white z-50">
      <div className="flex items-center space-x-[64px]">
        <div
          className="cursor-pointer font-bold flex hover:text-main"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="pr-2" />
          PAWEVER
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-base font-medium">
          <Link to="/AnimalDetail/1" className="hover:text-main px-5">
            입양동물찾기
          </Link>
          <Link to="/Community" className="hover:text-main px-5">
            커뮤니티
          </Link>
          <Link to="/EditReservation" className="hover:text-main px-5">
            예약/상담
          </Link>
          <Link to="/Donation" className="hover:text-main px-5">
            후원하기
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <ButtonComponent onClick={handleIsMenuOpen} bgcolor="bg-main">
          메뉴
        </ButtonComponent>
      </div>

      {/* SidebarM for Mobile */}
      <SidebarM isOpen={isMenuOpen} onClose={handleIsMenuOpen} />

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isLoggined ? (
          <ButtonComponent
            onClick={handleLogout}
            bgcolor="white"
            text="black"
            className="border-[1px] border-gray-300 hover:bg-white font-medium"
          >
            로그아웃
          </ButtonComponent>
        ) : (
          <>
            <ButtonComponent onClick={handleQuickLogin}>
              빠른 로그인
            </ButtonComponent>
            <ButtonComponent
              bgcolor="white"
              text="black"
              className="border-[1px] border-gray-300 hover:bg-white font-medium"
              onClick={handleQuickLogin}
            >
              로그인
            </ButtonComponent>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
