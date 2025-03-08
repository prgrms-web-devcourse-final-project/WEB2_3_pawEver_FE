import { useRef } from "react";
import { Link } from "react-router-dom";
import { Animal } from "../../../hooks/useProtectedAnimals";
import NearbyAnimals from "../../../common/NearbyAnimals";

interface CardSectionProps {
  title: string;
  cards: number;

  // 보호중인 동물 섹션 props
  protectedAnimals?: Animal[];
  isProtectedLoading?: boolean;
  isProtectedError?: boolean;

  // "User님 근처의 동물" 섹션 props
  animals?: any[]; // 받아온 동물 배열 (강아지+고양이 병합 데이터)
  isLoading?: boolean;
  isError?: boolean;
  fetchAllowed?: boolean; // 현재 API 호출이 되었는지 여부
  onSearch?: () => void; // 버튼 클릭 시 실행할 함수
}

export default function CardSection({
  title,
  cards,
  protectedAnimals,
  isProtectedLoading,
  isProtectedError,
  animals,
  isLoading,
  isError,
  fetchAllowed,
  onSearch,
}: CardSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between mb-4 pl-1 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[1.375rem]">{title}</p>
          {/* "동물찾기" 버튼 - onSearch가 있으면 표시 */}
          {onSearch && (
            <button
              onClick={onSearch}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
            >
              동물찾기
            </button>
          )}
        </div>

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

      {/* 가로 스크롤 영역 */}
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
          {/* 보호중인 동물 섹션 */}
          {protectedAnimals !== undefined ? (
            isProtectedLoading ? (
              <p className="pl-1">보호중인 동물 정보를 불러오는 중...</p>
            ) : isProtectedError ? (
              <p className="pl-1">
                데이터를 가져오는 도중 오류가 발생했습니다.
              </p>
            ) : protectedAnimals.length > 0 ? (
              // API에서 가져온 보호중인 동물 데이터 표시
              protectedAnimals.slice(0, cards).map((animal, index) => (
                <div
                  key={animal.id}
                  className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
                >
                  <Link to={`/AnimalBoard/${animal.id}`}>
                    <NearbyAnimals
                      id={animal.id}
                      imageUrl={animal.imageUrl}
                      name={animal.name}
                      providerShelterName={animal.providerShelterName}
                      neuteredStatus={animal.neuteredStatus}
                      characteristics={animal.characteristics}
                    />
                  </Link>
                </div>
              ))
            ) : (
              <p className="pl-1">보호중인 동물이 없습니다.</p>
            )
          ) : !fetchAllowed ? (
            // "User님 근처의 동물" 섹션이고 버튼 클릭 전
            <p className="pl-1">버튼을 눌러 내 근처 동물을 찾아보세요!</p>
          ) : isLoading ? (
            <p className="pl-1">불러오는 중...</p>
          ) : isError ? (
            <p className="pl-1">데이터를 가져오는 도중 오류가 발생했습니다.</p>
          ) : animals && animals.length > 0 ? (
            // 주변 동물 데이터 (강아지+고양이 병합 데이터)
            animals.slice(0, cards).map((animal, index) => (
              <div
                key={animal.id || index}
                className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
              >
                <Link to={`/AnimalBoard/${animal.id}`}>
                  <NearbyAnimals
                    id={animal.id}
                    imageUrl={animal.imageUrl}
                    name={animal.name || "이름 없음"}
                    providerShelterName={animal.providerShelterName}
                    neuteredStatus={animal.neuteredStatus}
                    characteristics={animal.characteristics || []}
                  />
                </Link>
              </div>
            ))
          ) : (
            // fetchAllowed=true지만, 빈 배열
            <p className="pl-1">근처에 보호 중인 동물이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
