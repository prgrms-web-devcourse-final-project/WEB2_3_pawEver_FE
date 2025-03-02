import { useRef } from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../../../common/AnimalCard";

interface CardSectionProps {
  title: string;
  cards: number;
}

export default function CardSection({ title, cards }: CardSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 현재 첫번째 카드의 실제 너비만큼 스크롤 이동 (한 번에 한 카드씩)
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current && containerRef.current.firstElementChild) {
      const cardWidth = containerRef.current.firstElementChild.clientWidth;
      containerRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4 pl-1 max-w-[1200px] mx-auto">
        <p className="font-semibold text-[1.375rem]">{title}</p>
        <div className="flex items-center">
          <p className="font-semibold text-base text-gray-400">전체보기</p>
          <div className="flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
            <button
              onClick={() => scroll("left")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[1.125rem]">&lt;</span>
            </button>
            <div className="w-[1px] h-full bg-gray-300" />
            <button
              onClick={() => scroll("right")}
              className="w-1/2 h-full text-gray-300 flex items-center justify-center"
            >
              <span className="text-[1.125rem]">&gt;</span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {Array(cards)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                // sm 이상에서는 Community.tsx와 동일하게 min/max width 적용
                className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
              >
                <Link to={`/AnimalBoard/${index + 1}`}>
                  <AnimalCard />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
