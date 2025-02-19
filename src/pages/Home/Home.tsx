import { useRef } from "react";
import main_img from "../../assets/images/main_img.png";
import Dropdown from "../../common/DropDownComponent";
import AnimalCard from "../../common/AnimalCard";

// 스크롤 가능한 카드 섹션 컴포넌트
interface CardSectionProps {
  title: string;
  cards: number;
}

const CardSection = ({ title, cards }: CardSectionProps) => {
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
    <div className="w-full max-w-[1060px] mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-[22px]">{title}</p>
        <div className="flex items-center">
          <p className="font-semibold text-[16px] text-gray-400">전체보기</p>
          <div className="hidden sm:flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
            <button
              onClick={() => scroll("left")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[18px]">{"<"}</span>
            </button>
            <div className="w-[1px] h-full bg-gray-300"></div>
            <button
              onClick={() => scroll("right")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[18px]">{">"}</span>
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
                <AnimalCard />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const filters = [
    { label: "동물 구분", options: ["선택하세요", "개", "고양이"] },
    { label: "나이", options: ["선택하세요", "1살 이하", "1~3살", "4살 이상"] },
    { label: "성별", options: ["선택하세요", "수컷", "암컷"] },
    { label: "지역", options: ["선택하세요", "서울", "부산", "대구", "기타"] },
  ];

  return (
    <div className="flex flex-col justify-center">
      <div className="w-full max-w-[1060px] min-h-[380px] sm:min-h-[420px] bg-[#E3F6FF] mt-6 mb-6 mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 py-12 sm:py-14 rounded-lg relative">
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
          <p className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold leading-snug">
            나에게 맞는 입양동물이
            <br className="hidden sm:block" />
            궁금하다면?
          </p>
          <button className="mt-4 w-[112px] h-[48px] bg-[#09ACFB] text-white rounded-lg hover:bg-blue-600">
            찾아보기
          </button>
        </div>
        <img
          src={main_img}
          alt="Main Image"
          className="w-[180px] sm:w-[250px] md:w-auto mt-4 sm:mt-0"
        />
      </div>

      <div className="w-full min-h-[140px] sm:h-[154px] bg-gray-50 mb-6 items-center hidden sm:flex">
        <div className="w-full max-w-[1060px] mx-auto flex flex-wrap sm:flex-nowrap">
          {filters.map((filter, index) => (
            <div
              key={index}
              className={`w-full sm:w-[259px] flex flex-col ${
                index > 0 ? "ml-2" : ""
              }`}
            >
              <p className="text-sm text-[#414651]">{filter.label}</p>
              <Dropdown options={filter.options} />
            </div>
          ))}
        </div>
      </div>

      <CardSection title="보호중인 동물" cards={9} />

      <div className="mt-8">
        <CardSection title="User님 근처의 동물" cards={5} />
      </div>
    </div>
  );
}
