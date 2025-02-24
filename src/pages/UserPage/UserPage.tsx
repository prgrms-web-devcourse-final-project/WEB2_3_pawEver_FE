import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import edit from "../../assets/icons/edit.svg";
import main_img from "../../assets/images/main_img.png";
import AnimalCard from "../../common/AnimalCard";
import Input from "../../common/InputComponent";

interface AnimalCardSliderProps {
  cards: number;
}

const staffMenuItems = [
  "예약/상담 확인하기",
  "후원 내역 확인하기",
  "보호중인 친구들",
];

function UserProfile() {
  return (
    <div className="w-full max-w-[873px] flex flex-col sm:flex-row items-center justify-between">
      <img
        src={main_img}
        alt="User Profile"
        className="w-[160px] h-[160px] rounded-full mb-4 sm:mb-0 order-first sm:order-last"
      />

      <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] sm:items-start items-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <p className="text-xl lg:text-2xl font-semibold">Quokka3764</p>
          <p className="text-sm text-[#91989E]">example@gmail.com</p>
        </div>
        <p className="text-md text-gray-500 text-center sm:text-left w-full">
          안녕하세요! 저는 동물을 사랑하는 개발자입니다. 🐶🐱
        </p>
        <button className="w-[130px] h-[50px] flex items-center justify-center bg-main text-white rounded-lg hover:bg-blue-500">
          프로필 수정
          <img src={edit} alt="Edit Icon" className="w-5 h-5 fill-white ml-2" />
        </button>
      </div>
    </div>
  );
}

function UserMenu() {
  const [selected, setSelected] = useState("작성한 글");
  const menuItems = ["작성한 글", "내 친구들", "예약 내역", "후원 내역"];

  return (
    <div className="w-full max-w-[873px] flex justify-between items-center bg-[#F0F8FF] rounded-lg px-2 sm:px-4">
      <div className="w-full flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 py-2">
        {menuItems.map((item, index) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={`text-lg text-center font-medium ${
              selected === item
                ? "bg-blue-500 text-white rounded-lg"
                : "text-gray-500"
            } ${index !== 0 ? "sm:ml-[37px]" : ""}`}
            style={{
              flex: 1,
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

const AnimalCardSlider: React.FC<AnimalCardSliderProps> = ({ cards }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mt-[109px]">
        <p className="font-semibold text-[1.375rem]">
          내 친구들 💙{" "}
          <span className="text-sm text-[#91989E] font-normal block sm:inline sm:text-left">
            사라진 친구가 있다면 좋은 곳으로 입양을 간것입니다!
          </span>
        </p>
        <div className="flex items-center">
          <div className="hidden sm:flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
            <button
              onClick={() => scroll("left")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[1.125rem]">{"<"}</span>
            </button>
            <div className="w-[1px] h-full bg-gray-300"></div>
            <button
              onClick={() => scroll("right")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[1.125rem]">{">"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className="h-[290px] flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {Array(cards)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex-none snap-start">
                <Link to={`/community/${index + 1}`}>
                  <AnimalCard />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const GeneralUserPage: React.FC = () => {
  return (
    <div className="w-full max-w-[873px] mx-auto ">
      <div className="flex justify-center">
        <div className="w-full max-w-[873px]  flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          <UserProfile />
        </div>
      </div>
      <div className="flex justify-center mt-14 ">
        <UserMenu />
      </div>
    </div>
  );
};

function StaffMenu() {
  const [selectedMenu, setSelectedMenu] = useState(staffMenuItems[0]);

  return (
    <div className="mt-[144px] flex flex-row gap-4">
      {staffMenuItems.map((item) => (
        <button
          key={item}
          className={`text-2xl ${
            selectedMenu === item ? "text-blue-500 font-bold" : "text-gray-800"
          } transition-colors`}
          onClick={() => setSelectedMenu(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function StaffPage() {
  return (
    <div className="w-full max-w-[873px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[60px]">
          <UserProfile />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-2xl">보호센터명</label>
              <Input placeholder="보호센터명을 입력하세요" width={300} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-2xl">보호소 전화번호</label>
              <Input placeholder="보호소 전화번호를 입력하세요" width={300} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-2xl">담당자 연락처</label>
              <Input placeholder="담당자 연락처를 입력하세요" width={300} />
            </div>
          </div>
        </div>
        <StaffMenu />
      </div>
    </div>
  );
}

function UserPage({ defaultIsStaff }: { defaultIsStaff: boolean }) {
  const [isStaff, setIsStaff] = useState(defaultIsStaff);

  return (
    <div>
      <button
        onClick={() => setIsStaff(!isStaff)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Toggle Role
      </button>
      {isStaff ? <StaffPage /> : <GeneralUserPage />}
    </div>
  );
}

export default UserPage;
