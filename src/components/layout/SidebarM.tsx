import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import community from "../../assets/icons/community.svg";
import charity from "../../assets/icons/charity.svg";
import reservation from "../../assets/icons/reservation.svg";
import ButtonComponent from "../../common/ButtonComponent";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarM({ isOpen, onClose }: SidebarProps) {
  // Zustand 인증 상태 및 메소드 가져오기
  const { isLoggedIn, userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  // 로그인 핸들러
  const handleLogin = () => {
    // 사이드바 닫기
    onClose();

    // Header 컴포넌트의 모달 열기 함수 호출
    // setTimeout을 사용하여 사이드바가 닫힌 후 모달이 열리도록 함
    setTimeout(() => {
      // Header 컴포넌트의 handleLoginClick 함수를 직접 접근할 수 없으므로
      // 커스텀 이벤트를 발생시켜 Header 컴포넌트에게 알림
      const event = new CustomEvent("openLoginModal");
      window.dispatchEvent(event);
    }, 300); // 사이드바 애니메이션 시간(300ms)과 동일하게 설정
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await logout();
    onClose(); // 사이드바 닫기
  };

  // 유저 페이지로 이동하는 핸들러
  const handleUserPageNavigate = () => {
    if (userInfo?.id) {
      navigate(`/UserPage/${userInfo.id}`);
      onClose(); // 사이드바 닫기
    }
  };

  // 기본 프로필 이미지
  const defaultProfileImg = logo;

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
            className="flex gap-2 justify-center items-center"
            onClick={onClose}
          >
            <img src={logo} alt="PAWEVER Logo" className="h-8 mx-auto" />
            <p className="font-bold text-sm"> PAWEVER </p>
          </Link>
        </div>

        {/* 유저 프로필 영역 - 로그인 상태에 따라 조건부 렌더링 */}
        <div className="p-6 text-center">
          {isLoggedIn && userInfo ? (
            // 로그인 상태일 때
            <div className="cursor-pointer" onClick={handleUserPageNavigate}>
              <p className="font-semibold text-gray-700">
                어서오세요{" "}
                <span className="text-main font-bold">{userInfo.name}</span>님
              </p>
              <div className="w-24 h-24 mx-auto my-4 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 overflow-hidden">
                {userInfo.picture ? (
                  <img
                    src={userInfo.picture}
                    alt={`${userInfo.name}의 프로필`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultProfileImg}
                    className="w-12 h-12"
                    alt="기본 프로필"
                  />
                )}
              </div>
            </div>
          ) : (
            // 로그인 상태가 아닐 때
            <div>
              <p className="font-semibold text-gray-700">
                로그인하고 더 많은 기능을 이용해보세요
              </p>
              <div className="w-24 h-24 mx-auto my-4 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                <img
                  src={defaultProfileImg}
                  className="w-12 h-12"
                  alt="기본 프로필"
                />
              </div>
            </div>
          )}
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col space-y-4 p-4">
          <Link
            to="/AnimalBoard"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="PAWEVER Logo" className="h-6 " />
            <span>입양동물찾기</span>
          </Link>
          <Link
            to="/community"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <img src={community} className="h-6 " />
            <span>커뮤니티</span>
          </Link>
          <Link
            to="/EditReservation"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <img src={reservation} alt="PAWEVER Logo" className="h-6 " />
            <span>예약상담</span>
          </Link>
          <Link
            to="/Donation"
            onClick={onClose}
            className="flex items-center space-x-2 "
          >
            <img src={charity} alt="PAWEVER Logo" className="h-6 " />
            <span>Donation</span>
          </Link>
        </nav>

        {/* 로그인/로그아웃 버튼 */}
        <div className="p-4 mt-6">
          {isLoggedIn ? (
            <ButtonComponent className="w-full" onClick={handleLogout}>
              로그아웃
            </ButtonComponent>
          ) : (
            <ButtonComponent className="w-full" onClick={handleLogin}>
              로그인
            </ButtonComponent>
          )}
        </div>
      </div>
    </>
  );
}
