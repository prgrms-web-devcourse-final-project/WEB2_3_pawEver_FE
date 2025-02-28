import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import TestCard from "../../common/TestCard";
import board_sliders from "../../assets/icons/board-sliders.svg";
import Dropdown from "../../common/DropDownComponent";
import SkeletonCard from "../../common/SkeletonCard";
import { useFetchAnimals } from "../../hooks/useFetchAnimals";

export default function AnimalBoard() {
  // 페이지
  const PAGE_SIZE = 20;

  const {
    getAllAnimals,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchAnimals(PAGE_SIZE);

  // 필터 상태 관리
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  // 필터 드롭다운 예제 데이터
  const filters = [
    { label: "종류", options: ["강아지", "고양이", "기타"] },
    { label: "지역", options: ["서울", "부산", "대구", "인천"] },
    { label: "성별", options: ["남아", "여아"] },
  ];

  // 모든 동물 데이터 가져오기
  const allAnimals = getAllAnimals();

  // 긴급 동물 필터링
  const urgentAnimals = useMemo(() => {
    const now = new Date();

    const filtered = allAnimals.filter((animal) => {
      if (!animal.noticeEdt) return false;

      try {
        const year = parseInt(animal.noticeEdt.substring(0, 4), 10);
        const month = parseInt(animal.noticeEdt.substring(4, 6), 10) - 1;
        const day = parseInt(animal.noticeEdt.substring(6, 8), 10);

        if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

        const noticeDate = new Date(year, month, day);
        const diffDays =
          (noticeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 14;
      } catch (e) {
        return false;
      }
    });

    // 중복 제거 (Map 사용)
    const map = new Map();
    filtered.forEach((animal) => {
      map.set(animal.desertionNo, animal);
    });

    return Array.from(map.values());
  }, [allAnimals]);

  // 무한 스크롤
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log("다음 페이지 로딩 시작");
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    // Intersection Observer 설정
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "200px", // 미리 로딩 시작
      threshold: 0.1,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    // 클린업
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [observerCallback]);

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="w-full my-8 text-center">
        <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
          <p className="text-red-600">
            데이터를 불러오는 중 오류가 발생했습니다
          </p>
          <p className="text-sm text-red-500">
            {error?.message || "알 수 없는 오류"}
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mt-10 mb-1">
          <p className="text-xl font-semibold mb-1">보호 중인 동물</p>
          <img
            src={board_sliders}
            alt="필터 아이콘"
            className="w-5 h-5 cursor-pointer"
            onClick={toggleFilters}
          />
        </div>

        {showFilters && (
          <div className="bg-[#E5F6FF] w-full rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 mt-3 px-4 sm:pl-[86px]">
              {filters.map((filter, index) => (
                <div key={index} className="flex flex-col w-full sm:w-[130px]">
                  <p className="text-sm text-[#414651]">{filter.label}</p>
                  <Dropdown
                    className="text-xs text-[#91989E]"
                    options={filter.options}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-7 px-4 sm:pl-[86px]">
              <input
                type="text"
                placeholder="강아지를 입력해주세요."
                className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
              />
              <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
                검색
              </button>
            </div>
          </div>
        )}

        {/* 동물 카드 그리드 */}
        <div className="grid gap-4 mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* 초기 로딩 중일 때 Skeleton 표시 */}
          {isLoading
            ? [...Array(8)].map((_, index) => (
                // 2) 추가: 스켈레톤에 'skeleton-fade' 클래스 적용
                <div className="skeleton-fade" key={index}>
                  <SkeletonCard />
                </div>
              ))
            : urgentAnimals.map((animal) => (
                <Link
                  key={animal.desertionNo}
                  to={`/AnimalBoard/${animal.desertionNo}`}
                  className="w-full"
                >
                  <div className="w-[256px]">
                    <TestCard
                      desertionNo={animal.desertionNo}
                      popfile={animal.popfile}
                      kindCd={animal.kindCd}
                      careNm={animal.careNm}
                      neuterYn={animal.neuterYn}
                      weight={animal.weight}
                    />
                  </div>
                </Link>
              ))}

          {/* 추가 로딩 중일 때 Skeleton 표시 */}
          {isFetchingNextPage &&
            [...Array(4)].map((_, index) => (
              // 동일하게 'skeleton-fade' 클래스 적용
              <div className="skeleton-fade" key={`loading-${index}`}>
                <SkeletonCard />
              </div>
            ))}
        </div>

        {/* 무한 스크롤 감지 영역 */}
        <div ref={loadMoreRef} className="h-10" />
      </div>
    </section>
  );
}
