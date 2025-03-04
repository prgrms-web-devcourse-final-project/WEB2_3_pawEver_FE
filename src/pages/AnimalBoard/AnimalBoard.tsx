// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { useFetchAnimals } from "../../hooks/useFetchAnimals";
// import { useAnimalStore } from "../../store/animalStore";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";

// export default function AnimalBoard() {
//   const PAGE_SIZE = 20;
//   const {
//     getAllAnimals,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useFetchAnimals(PAGE_SIZE);

//   //Zustand에 저장
//   const animals = useMemo(() => getAllAnimals(), [getAllAnimals]);
//   const setAnimals = useAnimalStore((state) => state.setAnimals);

//   // 데이터를 받아오면 전역 스토어에 저장
//   useEffect(() => {
//     if (animals.length > 0) {
//       setAnimals(animals);
//     }
//   }, [animals, setAnimals]);

// 필터 상태 관리
//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   // 필터 드롭다운 예제 데이터
//   const filters = [
//     { label: "종류", options: ["강아지", "고양이", "기타"] },
//     { label: "지역", options: ["서울", "부산", "대구", "인천"] },
//     { label: "성별", options: ["남아", "여아"] },
//   ];

//   // 긴급 동물 필터링
//   const urgentAnimals = useMemo(() => {
//     const now = new Date();
//     return (
//       animals
//         .filter((animal) => {
//           if (!animal.noticeEdt) return false;
//           try {
//             const year = parseInt(animal.noticeEdt.substring(0, 4), 10);
//             const month = parseInt(animal.noticeEdt.substring(4, 6), 10) - 1;
//             const day = parseInt(animal.noticeEdt.substring(6, 8), 10);
//             if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

//             const noticeDate = new Date(year, month, day);
//             const diffDays =
//               (noticeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
//             return diffDays <= 14;
//           } catch (e) {
//             return false;
//           }
//         })
//         // 중복 제거 (Map 사용)
//         .reduce((map, animal) => map.set(animal.desertionNo, animal), new Map())
//         .values()
//     );
//   }, [animals]);

//   // 무한 스크롤
//   const loadMoreRef = useRef<HTMLDivElement>(null);

//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         console.log("다음 페이지 로딩 시작");
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     // Intersection Observer 설정
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px", // 미리 로딩 시작
//       threshold: 0.1,
//     });

//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);

//     // 클린업
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   // 에러 상태 처리
//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error?.message || "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full my-8 ">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {filters.map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 동물 카드 그리드 - 모바일에서도 2열 그리드 유지 */}
//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {/* 초기 로딩 중일 때 Skeleton 표시 */}
//           {isLoading
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : Array.from(urgentAnimals).map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}

//           {/* 추가 로딩 중일 때 Skeleton 표시 */}
//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={`loading-${index}`}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         {/* 무한 스크롤 감지 영역 */}
//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link, useLoaderData } from "react-router-dom";
// import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";
// import fetchAnimals from "../../api/fetchAnimals";
// import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";
// import { useAnimalStore } from "../../store/animalStore";

// export default function AnimalBoard() {
//   const PAGE_SIZE = 20;

//   // loader에서 미리 받아온 초기 데이터
//   const initialData = useLoaderData() as AnimalsResponse;

//   // 무한 스크롤용 쿼리 설정 (loader 데이터로 초기 데이터 설정)
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["animalsList", PAGE_SIZE],
//     queryFn: ({ pageParam = 1 }) =>
//       fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages) => {
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = allPages.length * PAGE_SIZE;
//       return loadedItems < totalCount ? allPages.length + 1 : undefined;
//     },
//     initialData: {
//       pages: [initialData],
//       pageParams: [1],
//     } as InfiniteData<AnimalsResponse>,
//   });

//   // 모든 페이지의 동물 데이터를 하나의 배열로 평탄화
//   const animals: Animal[] = useMemo(() => {
//     return (
//       data?.pages.flatMap((page) => page.response?.body?.items?.item ?? []) ||
//       []
//     );
//   }, [data]);

//   // Zustand에 저장: loader 혹은 추가 로딩된 동물 데이터 업데이트
//   const setAnimals = useAnimalStore((state) => state.setAnimals);
//   useEffect(() => {
//     if (animals.length > 0) {
//       setAnimals(animals);
//     }
//   }, [animals, setAnimals]);

//   // 필터 상태 관리
//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   // 긴급 동물 필터링: 긴급 공고 기간(예: noticeEdt가 14일 이내) 기준
//   const urgentAnimals = useMemo(() => {
//     const now = new Date();
//     const filtered = animals.filter((animal) => {
//       if (!animal.noticeEdt) return false;
//       try {
//         const year = parseInt(animal.noticeEdt.substring(0, 4), 10);
//         const month = parseInt(animal.noticeEdt.substring(4, 6), 10) - 1;
//         const day = parseInt(animal.noticeEdt.substring(6, 8), 10);
//         if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

//         const noticeDate = new Date(year, month, day);
//         const diffDays =
//           (now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24);
//         return diffDays >= 0 && diffDays <= 14;
//       } catch (e) {
//         return false;
//       }
//     });

//     // desertionNo를 기준으로 중복 제거한 후 배열로 변환
//     const deduped = filtered.reduce(
//       (map, animal) => map.set(animal.desertionNo, animal),
//       new Map()
//     );
//     return Array.from(deduped.values());
//   }, [animals]);

//   // 무한 스크롤: 감지 영역(ref) 설정
//   const loadMoreRef = useRef<HTMLDivElement>(null);
//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         console.log("다음 페이지 로딩 시작");
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px",
//       threshold: 0.1,
//     });
//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error?.message || "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full my-8">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {[
//                 { label: "종류", options: ["강아지", "고양이", "기타"] },
//                 { label: "지역", options: ["서울", "부산", "대구", "인천"] },
//                 { label: "성별", options: ["남아", "여아"] },
//               ].map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 동물 카드 그리드 */}
//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {isLoading
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : urgentAnimals.map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}

//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={`loading-${index}`}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         {/* 무한 스크롤 감지 영역 */}
//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

//

// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link, useLoaderData } from "react-router-dom";
// import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";
// import fetchAnimals from "../../api/fetchAnimals";
// import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";
// import { useAnimalStore } from "../../store/animalStore";

// export default function AnimalBoard() {
//   const PAGE_SIZE = 20;

//   // loader에서 미리 받아온 초기 데이터
//   const initialData = useLoaderData() as AnimalsResponse;

//   // 무한 스크롤용 쿼리 설정 (loader 데이터로 초기 데이터 설정)
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["animalsList", PAGE_SIZE],
//     queryFn: ({ pageParam = 1 }) =>
//       fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, allPages) => {
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = allPages.length * PAGE_SIZE;
//       return loadedItems < totalCount ? allPages.length + 1 : undefined;
//     },
//     initialData: {
//       pages: [initialData],
//       pageParams: [1],
//     } as InfiniteData<AnimalsResponse>,
//   });

//   // 모든 페이지의 동물 데이터를 하나의 배열로 평탄화
//   const animals: Animal[] = useMemo(() => {
//     return (
//       data?.pages.flatMap((page) => page.response?.body?.items?.item ?? []) ||
//       []
//     );
//   }, [data]);

//   // Zustand에 저장: loader 혹은 추가 로딩된 동물 데이터 업데이트
//   const setAnimals = useAnimalStore((state) => state.setAnimals);
//   useEffect(() => {
//     if (animals.length > 0) {
//       setAnimals(animals);
//     }
//   }, [animals, setAnimals]);

//   // 필터 상태 관리
//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   // (기존 urgentAnimals useMemo 코드 제거)

//   // 무한 스크롤: 감지 영역(ref) 설정
//   const loadMoreRef = useRef<HTMLDivElement>(null);
//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         console.log("다음 페이지 로딩 시작");
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px",
//       threshold: 0.1,
//     });
//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error?.message || "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full my-8">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {[
//                 { label: "종류", options: ["강아지", "고양이", "기타"] },
//                 { label: "지역", options: ["서울", "부산", "대구", "인천"] },
//                 { label: "성별", options: ["남아", "여아"] },
//               ].map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 동물 카드 그리드 */}
//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {isLoading
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : animals.map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}

//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={`loading-${index}`}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         {/* 무한 스크롤 감지 영역 */}
//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

//

// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link, useLoaderData } from "react-router-dom";
// import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";
// import fetchAnimals from "../../api/fetchAnimals";
// import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";
// import { useAnimalStore } from "../../store/animalStore";

// export default function AnimalBoard() {
//   const PAGE_SIZE = 20;
//   const { pageNo, numOfRows } = useLoaderData() as {
//     pageNo: number;
//     numOfRows: number;
//   };
//   const persistedAnimals = useAnimalStore((state) => state.animals); // Zustand에서 유지된 데이터

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["animalsList", numOfRows],
//     queryFn: ({ pageParam = pageNo }) =>
//       fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
//     initialPageParam: pageNo,
//     getNextPageParam: (lastPage, allPages) => {
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = allPages.length * PAGE_SIZE;
//       return loadedItems < totalCount ? allPages.length + 1 : undefined;
//     },
//     initialData:
//       persistedAnimals.length > 0
//         ? () => {
//             const persistedPage: AnimalsResponse = {
//               response: {
//                 body: {
//                   items: { item: persistedAnimals.slice(0, PAGE_SIZE) }, // 첫 페이지 크기만 추출
//                   totalCount: persistedAnimals.length, // 임시로 전체 개수 설정
//                   numOfRows: PAGE_SIZE,
//                   pageNo: pageNo,
//                 },
//               },
//             };
//             return {
//               pages: [persistedPage],
//               pageParams: [pageNo],
//             } as InfiniteData<AnimalsResponse>;
//           }
//         : undefined,
//     staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
//   });

//   const animals: Animal[] = useMemo(() => {
//     return (
//       data?.pages.flatMap((page) => page.response?.body?.items?.item ?? []) ||
//       []
//     );
//   }, [data]);

//   const setAnimals = useAnimalStore((state) => state.setAnimals);
//   useEffect(() => {
//     if (animals.length > 0) {
//       setAnimals(animals);
//     }
//   }, [animals, setAnimals]);

//   // 필터 상태 관리
//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   // 무한 스크롤: 감지 영역(ref) 설정
//   const loadMoreRef = useRef<HTMLDivElement>(null);
//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         console.log("다음 페이지 로딩 시작");
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px",
//       threshold: 0.1,
//     });
//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error?.message || "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full my-8">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {[
//                 { label: "종류", options: ["강아지", "고양이", "기타"] },
//                 { label: "지역", options: ["서울", "부산", "대구", "인천"] },
//                 { label: "성별", options: ["남아", "여아"] },
//               ].map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {isLoading && !data
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : animals.map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}

//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={`loading-${index}`}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

//SSR-like 초본

// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link, useLoaderData } from "react-router-dom";
// import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";
// import fetchAnimals from "../../api/fetchAnimals";
// import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";
// import { useAnimalStore } from "../../store/animalStore";

// export default function AnimalBoard() {
//   const PAGE_SIZE = 20;
//   const { pageNo, numOfRows } = useLoaderData() as {
//     pageNo: number;
//     numOfRows: number;
//   };

//   const storedInfiniteData = useAnimalStore(
//     (state) => state.animalsInfiniteData
//   );
//   const setAnimalsInfiniteData = useAnimalStore(
//     (state) => state.setAnimalsInfiniteData
//   );

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["animalsList", numOfRows],
//     queryFn: ({ pageParam = pageNo }) =>
//       fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
//     initialPageParam: pageNo,
//     getNextPageParam: (lastPage, allPages) => {
//       // item이 없을 수도 있으므로 안전 처리
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = allPages.reduce((sum, pg) => {
//         const pageItems = pg.response?.body?.items?.item ?? [];
//         return sum + pageItems.length;
//       }, 0);
//       return loadedItems < totalCount ? allPages.length + 1 : undefined;
//     },
//     // Zustand에 저장된 InfiniteData가 있다면 사용
//     initialData: storedInfiniteData ?? undefined,

//     // mount 시나 windowFocus 시 재패칭X
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,

//     // staleTime만 적용
//     staleTime: 5 * 60 * 1000,
//   });

//   const animals: Animal[] = useMemo(() => {
//     if (!data) return [];
//     return data.pages.flatMap((page) => page.response?.body?.items?.item ?? []);
//   }, [data]);

//   useEffect(() => {
//     if (data) {
//       setAnimalsInfiniteData(data);
//     }
//   }, [data, setAnimalsInfiniteData]);

//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   const loadMoreRef = useRef<HTMLDivElement>(null);
//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px",
//       threshold: 0.1,
//     });
//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error instanceof Error ? error.message : "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // data가 아직 없고 로딩중일 때만 스켈레톤
//   const showSkeleton = !data && isLoading;

//   return (
//     <section className="w-full my-8">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {[
//                 { label: "종류", options: ["강아지", "고양이", "기타"] },
//                 { label: "지역", options: ["서울", "부산", "대구", "인천"] },
//                 { label: "성별", options: ["남아", "여아"] },
//               ].map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {showSkeleton
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : animals.map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}

//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={index}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

//SSR-like 테스트

// import { useState, useRef, useCallback, useEffect, useMemo } from "react";
// import { Link, useLoaderData } from "react-router-dom";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import TestCard from "../../common/TestCard";
// import board_sliders from "../../assets/icons/board-sliders.svg";
// import Dropdown from "../../common/DropDownComponent";
// import SkeletonCard from "../../common/SkeletonCard";
// import fetchAnimals from "../../api/fetchAnimals";
// import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";
// // loader에서 반환하는 타입 정의
// import type { AnimalBoardLoaderData } from "../../loaders/animalBoardLoader";

// export default function AnimalBoard() {
//   // loader에서 준비한 데이터를 받아옴.
//   const { pageNo, numOfRows, initialInfiniteData } =
//     useLoaderData<AnimalBoardLoaderData>();

//   const PAGE_SIZE = numOfRows; // loader에서 받은 numOfRows를 PAGE_SIZE로 사용

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery<AnimalsResponse>({
//     // AnimalDetail과 쿼리 키를 공유하기 위해 numOfRows를 제거하고 ["animalsList"]로 통일
//     queryKey: ["animalsList"],
//     queryFn: ({ pageParam = pageNo }) =>
//       fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
//     initialPageParam: pageNo,
//     getNextPageParam: (lastPage, allPages) => {
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = allPages.reduce((sum, pg) => {
//         const pageItems = pg.response?.body?.items?.item ?? [];
//         return sum + pageItems.length;
//       }, 0);
//       return loadedItems < totalCount ? allPages.length + 1 : undefined;
//     },
//     initialData: initialInfiniteData,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     staleTime: 5 * 60 * 1000,
//   });

//   const animals: Animal[] = useMemo(() => {
//     if (!data) return [];
//     return data.pages.flatMap((page) => page.response?.body?.items?.item ?? []);
//   }, [data]);

//   // 무한 스크롤을 위한 IntersectionObserver 설정
//   const loadMoreRef = useRef<HTMLDivElement>(null);
//   const observerCallback = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(observerCallback, {
//       rootMargin: "200px",
//       threshold: 0.1,
//     });
//     const currentRef = loadMoreRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//       observer.disconnect();
//     };
//   }, [observerCallback]);

//   // 필터 토글 상태 관리 및 필터 배열 정의
//   const [showFilters, setShowFilters] = useState(false);
//   const toggleFilters = () => setShowFilters((prev) => !prev);

//   const filters = [
//     { label: "종류", options: ["전체", "강아지", "고양이", "기타"] },
//     { label: "나이", options: ["어린", "성인", "노령"] },
//     // 필요한 경우 추가 필터 항목 추가
//   ];

//   if (isError) {
//     return (
//       <div className="w-full my-8 text-center px-4">
//         <div className="max-w-[1200px] mx-auto bg-red-50 p-4 rounded">
//           <p className="text-red-600">
//             데이터를 불러오는 중 오류가 발생했습니다
//           </p>
//           <p className="text-sm text-red-500">
//             {error instanceof Error ? error.message : "알 수 없는 오류"}
//           </p>
//           <button
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => window.location.reload()}
//           >
//             새로고침
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 초기 로딩 중일 때 Skeleton UI 표시
//   const showSkeleton = isLoading;

//   return (
//     <section className="w-full my-8 ">
//       <div className="max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between mt-6 sm:mt-10 mb-1">
//           <p className="text-lg sm:text-xl font-semibold mb-1">
//             보호 중인 동물
//           </p>
//           <img
//             src={board_sliders}
//             alt="필터 아이콘"
//             className="w-5 h-5 cursor-pointer"
//             onClick={toggleFilters}
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
//               {filters.map((filter, index) => (
//                 <div key={index} className="flex flex-col w-full sm:w-[130px]">
//                   <p className="text-sm text-[#414651]">{filter.label}</p>
//                   <Dropdown
//                     className="text-xs text-[#91989E]"
//                     options={filter.options}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
//               <input
//                 type="text"
//                 placeholder="강아지를 입력해주세요."
//                 className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
//               />
//               <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
//                 검색
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 동물 카드 그리드 - 모바일에서도 2열 그리드 유지 */}
//         <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
//           {showSkeleton
//             ? [...Array(8)].map((_, index) => (
//                 <div className="skeleton-fade w-full" key={index}>
//                   <SkeletonCard />
//                 </div>
//               ))
//             : animals.map((animal) => (
//                 <Link
//                   key={animal.desertionNo}
//                   to={`/AnimalBoard/${animal.desertionNo}`}
//                   className="w-full flex justify-center"
//                 >
//                   <TestCard
//                     desertionNo={animal.desertionNo}
//                     popfile={animal.popfile}
//                     kindCd={animal.kindCd}
//                     careNm={animal.careNm}
//                     neuterYn={animal.neuterYn}
//                     weight={animal.weight}
//                   />
//                 </Link>
//               ))}
//           {isFetchingNextPage &&
//             [...Array(4)].map((_, index) => (
//               <div className="skeleton-fade w-full" key={`loading-${index}`}>
//                 <SkeletonCard />
//               </div>
//             ))}
//         </div>

//         {/* 무한 스크롤 감지 영역 */}
//         <div ref={loadMoreRef} className="h-10" />
//       </div>
//     </section>
//   );
// }

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import TestCard from "../../common/TestCard";
import board_sliders from "../../assets/icons/board-sliders.svg";
import Dropdown from "../../common/DropDownComponent";
import SkeletonCard from "../../common/SkeletonCard";
import fetchAnimals from "../../api/fetchAnimals";
import type { AnimalsResponse, Animal } from "../../api/fetchAnimals";

export default function AnimalBoard() {
  const pageNo = 1;
  const numOfRows = 20;
  const PAGE_SIZE = numOfRows;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<AnimalsResponse>({
    queryKey: ["animalsList"],
    queryFn: ({ pageParam = pageNo }) =>
      fetchAnimals({ pageNo: pageParam as number, numOfRows: PAGE_SIZE }),
    initialPageParam: pageNo,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
      const loadedItems = allPages.reduce((sum, pg) => {
        const pageItems = pg.response?.body?.items?.item ?? [];
        return sum + pageItems.length;
      }, 0);
      return loadedItems < totalCount ? allPages.length + 1 : undefined;
    },
    // loader에서 받아온 초기 데이터 관련 옵션 제거
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const animals: Animal[] = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.response?.body?.items?.item ?? []);
  }, [data]);

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

  // 필터 토글 상태 관리 및 필터 배열 정의
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  const filters = [
    { label: "종류", options: ["강아지", "고양이", "기타"] },
    { label: "지역", options: ["서울", "부산", "대구", "인천"] },
    { label: "성별", options: ["남아", "여아"] },
  ];

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

  // 초기 로딩 중일 때 Skeleton UI 표시
  const showSkeleton = isLoading;

  return (
    <section className="w-full my-8 ">
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
          <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
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

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
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

        {/* 동물 카드 그리드 - 모바일에서도 2열 그리드 유지 */}
        <div className="grid gap-x-3 gap-y-4 sm:gap-4 mt-5 sm:mt-7 mx-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {showSkeleton
            ? [...Array(8)].map((_, index) => (
                <div className="skeleton-fade w-full" key={index}>
                  <SkeletonCard />
                </div>
              ))
            : animals.map((animal) => (
                <Link
                  key={animal.desertionNo}
                  to={`/AnimalBoard/${animal.desertionNo}`}
                  className="w-full flex justify-center"
                >
                  <TestCard
                    desertionNo={animal.desertionNo}
                    popfile={animal.popfile}
                    kindCd={animal.kindCd}
                    careNm={animal.careNm}
                    neuterYn={animal.neuterYn}
                    weight={animal.weight}
                  />
                </Link>
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
