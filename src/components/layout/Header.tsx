import React, { useState } from "react";
import SidebarM from "./SidebarM";
import { Link } from "react-router-dom";
import ButtonComponent from "../../common/ButtonComponent";
import logo from "../../assets/icons/logo.svg";

export default function Header() {
  const [isLoggined, setIsLoggined] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleQuickLogin = () => setIsLoggined(true);
  const handleLogout = () => setIsLoggined(false);
  const handleIsMenuOpen = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="cursor-pointer font-bold flex items-center hover:text-main whitespace-nowrap"
            >
              <img src={logo} alt="logo" className="pr-2" />
              PAWEVER
            </Link>

            <nav className="hidden md:flex space-x-6 text-base font-medium">
              <Link
                to="/AnimalBoard"
                className="hover:text-main whitespace-nowrap"
              >
                입양동물찾기
              </Link>
              <Link
                to="/Community"
                className="hover:text-main whitespace-nowrap"
              >
                커뮤니티
              </Link>
              <Link
                to="/EditReservation"
                className="hover:text-main whitespace-nowrap"
              >
                예약/상담
              </Link>
              <Link
                to="/Donation"
                className="hover:text-main whitespace-nowrap"
              >
                후원하기
              </Link>
            </nav>
          </div>

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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <ButtonComponent onClick={handleIsMenuOpen} bgcolor="bg-main">
              메뉴
            </ButtonComponent>
          </div>
          <SidebarM isOpen={isMenuOpen} onClose={handleIsMenuOpen} />
        </div>
      </div>
    </header>
  );
}
