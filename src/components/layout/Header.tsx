import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";
import ButtonComponent from "../../common/ButtonComponent";
import logo from "../../assets/icons/logo.svg";
import SidebarM from "./SidebarM";
import LoginModal from "./LoginModal";
import LoadingSpinner from "../../common/LoadingSpinner";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand 스토어에서 로그인 상태와 액션, 사용자 정보, isProfileUpdating 가져오기
  const { isLoggedIn, userInfo, logout, resetState, isProfileUpdating } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenLoginModal = () => {
      setIsModalOpen(true);
    };
    window.addEventListener("openLoginModal", handleOpenLoginModal);
    return () => {
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, []);

  // 로그아웃 버튼 클릭 시
  const handleLogout = async () => {
    await logout();
    toast.success("로그아웃 되었습니다!", { duration: 1500 });
    const currentPath = window.location.pathname;
    const isChangingPath = currentPath.includes("/UserPage");
    if (isChangingPath) {
      navigate("/");
    }
  };

  // 강제 초기화 버튼 클릭 시, 제거할거에욧
  const handleForceReset = () => {
    resetState();
    localStorage.removeItem("auth-storage");

    const currentPath = window.location.pathname;
    const isChangingPath = currentPath.includes("/UserPage");
    if (isChangingPath) {
      navigate("/");
    }
  };

  const handleIsMenuOpen = () => setIsMenuOpen((prev) => !prev);
  const handleLoginClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 프로필 클릭 시 사용자 페이지 이동
  const handleProfileClick = () => {
    if (userInfo?.id) {
      navigate(`/UserPage/${userInfo.id}`);
    }
  };

  // 라우트 링크들
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
          {/* Left Section: 로고 + 네비게이션 */}
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
          {/* Right Section: 로그인/로그아웃 + 프로필 */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {userInfo &&
                  (isProfileUpdating ? (
                    <div className="flex items-center justify-center w-[80px] h-9">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div
                      className="flex items-center cursor-pointer space-x-2"
                      onClick={handleProfileClick}
                    >
                      <img
                        src={
                          userInfo.picture ||
                          "https://via.placeholder.com/36?text=Profile"
                        }
                        alt="프로필 이미지"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="text-base font-medium">
                        {userInfo.name || "사용자"}
                      </span>
                    </div>
                  ))}

                {/* 로그아웃 버튼 */}
                <ButtonComponent
                  onClick={handleLogout}
                  bgcolor="white"
                  text="black"
                  className="border-[1px] border-gray-300 hover:bg-white font-medium"
                >
                  로그아웃
                </ButtonComponent>

                {/* 강제 초기화 버튼 */}
                <ButtonComponent
                  onClick={handleForceReset}
                  bgcolor="white"
                  text="black"
                  className="border-[1px] border-gray-300 hover:bg-white font-medium"
                >
                  강제 초기화
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

          {/* 로그인 모달 */}
          <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      </div>
    </header>
  );
}
