import { useState, useRef, useCallback, useEffect } from "react";
import useFilterAnimals, { FilterParams } from "../../hooks/useFilterAnimals";
import FilterAnimals from "./components/FilterAnimals";
import TestCard from "../../common/TestCard";
import board_sliders from "../../assets/icons/board-sliders.svg";
import SkeletonCard from "../../common/SkeletonCard";
import { useSearchParams } from "react-router-dom";

export default function AnimalBoard() {
  // URL 쿼리 파라미터 관리
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 필터 표시 상태 읽기 (기본값: true)
  const showFiltersParam = searchParams.get("showFilters");

  // 필터 토글 상태 관리 (URL에서 초기값 설정)
  const [showFilters, setShowFilters] = useState(
    showFiltersParam === null ? true : showFiltersParam !== "false"
  );

  // 필터 토글 핸들러 (URL도 업데이트)
  const toggleFilters = () => {
    const newValue = !showFilters;
    setShowFilters(newValue);

    // URL 쿼리 파라미터 복사 후 showFilters 값 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("showFilters", newValue.toString());
    setSearchParams(newSearchParams);
  };

  // 컴포넌트 마운트 시 showFilters 값이 URL에 없으면 추가
  useEffect(() => {
    if (showFiltersParam === null) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("showFilters", "true"); // 기본값은 true
      setSearchParams(newSearchParams);
    }
  }, []);

  // URL에서 초기 필터 상태 읽기
  const getInitialFilters = (): FilterParams => {
    const params: FilterParams = {};

    // URL에서 필터 값 추출
    const species = searchParams.get("species");
    const sex = searchParams.get("sex");
    const age = searchParams.get("age");
    const q = searchParams.get("q");

    if (species) params.species = species;
    if (sex) params.sex = sex;
    if (age) params.age = age;
    if (q) params.q = q;

    return params;
  };

  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterParams>(getInitialFilters());

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);

    // 기존 URL 파라미터를 유지하면서 필터값만 업데이트
    const newSearchParams = new URLSearchParams(searchParams);

    // 기존 필터 파라미터 제거
    ["species", "sex", "age", "q"].forEach((key) => {
      newSearchParams.delete(key);
    });

    // 새 필터 파라미터 추가
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, String(value));
      }
    });

    setSearchParams(newSearchParams);
  };

  // useFilterAnimals 훅을 사용하여 필터링된 동물 데이터 가져오기
  const {
    allAnimals,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilterAnimals(filters);

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "200px",
      threshold: 0.1,
    });
    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [observerCallback]);

  if (isError) {
    return (
      <div className="w-full my-8 text-center px-4">
        <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
          <p className="text-red-600">
            데이터를 불러오는 중 오류가 발생했습니다
          </p>
          <p className="text-sm text-red-500">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
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

  const showSkeleton = isLoading;

  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
          <p className="text-lg sm:text-xl font-semibold mb-1">
            보호 중인 동물
          </p>
          <img
            src={board_sliders}
            alt="필터 아이콘"
            className="w-5 h-5 cursor-pointer"
            onClick={toggleFilters}
          />
        </div>

        {showFilters && (
          <FilterAnimals
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        )}

        {/* 동물 카드 그리드 */}
        <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {showSkeleton
            ? [...Array(8)].map((_, index) => (
                <div className="skeleton-fade w-full" key={`skeleton-${index}`}>
                  <SkeletonCard />
                </div>
              ))
            : allAnimals.map((animal, index) => (
                <div
                  key={`${animal.id}-${index}`}
                  className="w-full flex justify-center"
                >
                  <TestCard
                    desertionNo={animal?.id}
                    popfile={animal?.imageUrl}
                    kindCd={animal?.name}
                    careNm={animal?.providerShelterName}
                    neuterYn={animal?.neuteredStatus}
                    sexCd={animal?.characteristics?.[0]}
                    weight={animal?.characteristics?.[1]}
                  />
                </div>
              ))}
          {isFetchingNextPage &&
            [...Array(4)].map((_, index) => (
              <div className="skeleton-fade w-full" key={`loading-${index}`}>
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
