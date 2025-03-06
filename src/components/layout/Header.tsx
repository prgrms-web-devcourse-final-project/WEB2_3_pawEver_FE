import { useState } from "react";
import SidebarM from "./SidebarM";
import { Link } from "react-router-dom";
import ButtonComponent from "../../common/ButtonComponent";
import logo from "../../assets/icons/logo.svg";
import LoginModal from "./LoginModal";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand 스토어에서 로그인 상태와 액션 가져오기
  const { isLoggedIn, userInfo, logout } = useAuthStore();

  const handleLogout = async () => {
    // Zustand 스토어의 logout 액션 사용
    await logout();
  };

  const handleIsMenuOpen = () => setIsMenuOpen((prev) => !prev);

  const handleLoginClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  // 로그인 성공 시 모달만 닫음 (로그인 상태는 LoginModal에서 처리)
  const handleLoginSuccess = () => {
    // 모달을 즉시 닫지 않고, LoginModal에서 타이머 처리
  };

  const navLinks = [
    { to: "/AnimalBoard", label: "입양동물찾기" },
    { to: "/Community", label: "커뮤니티" },
    { to: "/EditReservation", label: "예약/상담" },
    { to: "/Donation", label: "후원하기" },
  ];

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
              {navLinks.map(({ to, label }, index) => (
                <Link
                  key={index}
                  to={to}
                  className="hover:text-main whitespace-nowrap"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <ButtonComponent
                  onClick={handleLogout}
                  bgcolor="white"
                  text="black"
                  className="border-[1px] border-gray-300 hover:bg-white font-medium"
                >
                  로그아웃
                </ButtonComponent>
              </>
            ) : (
              <ButtonComponent
                onClick={handleLoginClick}
                bgcolor="white"
                text="black"
                className="border-[1px] border-gray-300 hover:bg-white font-medium"
              >
                로그인
              </ButtonComponent>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <ButtonComponent onClick={handleIsMenuOpen} bgcolor="bg-main">
              메뉴
            </ButtonComponent>
          </div>
          <SidebarM isOpen={isMenuOpen} onClose={handleIsMenuOpen} />

          {/* 모달은 항상 렌더링되고 isOpen 속성으로 표시 여부 제어 */}
          <LoginModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onLoginSuccess={handleLoginSuccess}
            onOpenModal={handleOpenModal}
          />
        </div>
      </div>
    </header>
  );
}
