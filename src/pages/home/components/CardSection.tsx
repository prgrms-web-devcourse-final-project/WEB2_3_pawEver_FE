// import { useRef } from "react";
// import { Link } from "react-router-dom";
// import NearbyAnimals from "../../../common/NearbyAnimals"
// //
// interface CardSectionProps {
//   title: string;
//   cards: number;
// }

// export default function CardSection({ title, cards }: CardSectionProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // 현재 첫번째 카드의 실제 너비만큼 스크롤 이동 (한 번에 한 카드씩)
//   const scroll = (direction: "left" | "right") => {
//     if (containerRef.current && containerRef.current.firstElementChild) {
//       const cardWidth = containerRef.current.firstElementChild.clientWidth;
//       containerRef.current.scrollBy({
//         left: direction === "left" ? -cardWidth : cardWidth,
//         behavior: "smooth",
//       });
//     }
//   };
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4 pl-1 max-w-[1200px] mx-auto">
//         <p className="font-semibold text-[1.375rem]">{title}</p>
//         <div className="flex items-center">
//           <p className="font-semibold text-base text-gray-400">전체보기</p>
//           <div className="flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
//             <button
//               onClick={() => scroll("left")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&lt;</span>
//             </button>
//             <div className="w-[1px] h-full bg-gray-300" />
//             <button
//               onClick={() => scroll("right")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&gt;</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <div
//           ref={containerRef}
//           className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {Array(cards)
//             .fill(0)
//             .map((_, index) => (
//               <div
//                 key={index}
//                 // sm 이상에서는 Community.tsx와 동일하게 min/max width 적용
//                 className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
//               >
//                 <Link to={`/AnimalBoard/${index + 1}`}>
//                   <NearbyAnimals />
//                 </Link>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// 나름 잘됨

// import { useRef } from "react";
// import { Link } from "react-router-dom";
// import NearbyAnimals from "../../../common/NearbyAnimals";

// // CardSectionProps에 'animals'를 추가
// interface CardSectionProps {
//   title: string;
//   cards: number;
//   // 서버에서 받아온 동물 배열 (optional)
//   animals?: any[];
// }

// export default function CardSection({
//   title,
//   cards,
//   animals,
// }: CardSectionProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // 스크롤 함수 (좌/우 버튼)
//   const scroll = (direction: "left" | "right") => {
//     if (containerRef.current && containerRef.current.firstElementChild) {
//       const cardWidth = containerRef.current.firstElementChild.clientWidth;
//       containerRef.current.scrollBy({
//         left: direction === "left" ? -cardWidth : cardWidth,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div>
//       {/* 상단 헤더 영역 */}
//       <div className="flex items-center justify-between mb-4 pl-1 max-w-[1200px] mx-auto">
//         <p className="font-semibold text-[1.375rem]">{title}</p>
//         <div className="flex items-center">
//           <p className="font-semibold text-base text-gray-400">전체보기</p>
//           <div className="flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
//             <button
//               onClick={() => scroll("left")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&lt;</span>
//             </button>
//             <div className="w-[1px] h-full bg-gray-300" />
//             <button
//               onClick={() => scroll("right")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&gt;</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 가로 스크롤 영역 */}
//       <div className="w-full overflow-x-auto">
//         <div
//           ref={containerRef}
//           className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {/* cards만큼 반복 */}
//           {Array(cards)
//             .fill(0)
//             .map((_, index) => {
//               // animals가 있으면 index번째 동물을 가져옴 (없으면 undefined)
//               const animal = animals && animals[index];

//               return (
//                 <div
//                   key={index}
//                   className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
//                 >
//                   <Link to={`/AnimalBoard/${animal?.id ?? index + 1}`}>
//                     {/*
//                       NearbyAnimals (이전 TestCard)
//                       animal이 없으면, 내부에서 "정보 없음" 처리 가능
//                     */}
//                     <NearbyAnimals
//                       id={animal?.id ?? index}
//                       imageUrl={animal?.imageUrl}
//                       name={animal?.name ?? "정보 없음"}
//                       providerShelterName={animal?.providerShelterName}
//                       neuteredStatus={animal?.neuteredStatus}
//                       characteristics={animal?.characteristics}
//                     />
//                   </Link>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </div>
//   );
// }

//

// import { useRef } from "react";
// import { Link } from "react-router-dom";
// import NearbyAnimals from "../../../common/NearbyAnimals";
// import AnimalCard from "../../../common/AnimalCard";

// // CardSectionProps 확장
// interface CardSectionProps {
//   title: string;
//   cards: number;
//   animals?: any[]; // 받아온 동물 배열
//   isLoading?: boolean;
//   isError?: boolean;
//   fetchAllowed?: boolean; // 현재 API 호출이 되었는지 여부
//   onSearch?: () => void; // 버튼 클릭 시 실행할 함수
// }

// export default function CardSection({
//   title,
//   cards,
//   animals,
//   isLoading,
//   isError,
//   fetchAllowed,
//   onSearch,
// }: CardSectionProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (containerRef.current && containerRef.current.firstElementChild) {
//       const cardWidth = containerRef.current.firstElementChild.clientWidth;
//       containerRef.current.scrollBy({
//         left: direction === "left" ? -cardWidth : cardWidth,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div>
//       {/* 상단 헤더 영역 */}
//       <div className="flex items-center justify-between mb-4 pl-1 max-w-[1200px] mx-auto">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-[1.375rem]">{title}</p>
//           {/* "동물찾기" 버튼 - 타이틀 옆 */}
//           {/* onSearch가 있으면 클릭 시 실행 */}
//           {onSearch && (
//             <button
//               onClick={onSearch}
//               className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
//             >
//               동물찾기
//             </button>
//           )}
//         </div>

//         <div className="flex items-center">
//           <p className="font-semibold text-base text-gray-400">전체보기</p>
//           <div className="flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
//             <button
//               onClick={() => scroll("left")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&lt;</span>
//             </button>
//             <div className="w-[1px] h-full bg-gray-300" />
//             <button
//               onClick={() => scroll("right")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">&gt;</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 아래 부분에서 isLoading, isError, fetchAllowed 등을 고려해 데이터 표시 */}
//       <div className="w-full overflow-x-auto">
//         <div
//           ref={containerRef}
//           className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {/*
//             1) 아직 fetchAllowed가 false이면 "데이터 없음" 표시 or 빈 카드
//             2) isLoading 중이면 로딩중
//             3) isError 발생 시 에러 메시지
//             4) 정상 데이터가 있으면 cards만큼 반복
//           */}

//           {!fetchAllowed ? (
//             // 버튼 누르기 전
//             <p className="pl-1">버튼을 눌러 내 근처 동물을 찾아보세요!</p>
//           ) : isLoading ? (
//             // 로딩 중
//             <p className="pl-1">불러오는 중...</p>
//           ) : isError ? (
//             // 에러
//             <p className="pl-1">데이터를 가져오는 도중 오류가 발생했습니다.</p>
//           ) : animals && animals.length > 0 ? (
//             // cards만큼 반복
//             Array(cards)
//               .fill(0)
//               .map((_, index) => {
//                 const animal = animals[index];
//                 return (
//                   <div
//                     key={index}
//                     className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
//                   >
//                     <Link to={`/AnimalBoard/${animal?.id ?? index + 1}`}>
//                       <NearbyAnimals
//                         id={animal?.id ?? index}
//                         imageUrl={animal?.imageUrl}
//                         name={animal?.name ?? "정보 없음"}
//                         providerShelterName={animal?.providerShelterName}
//                         neuteredStatus={animal?.neuteredStatus}
//                         characteristics={animal?.characteristics}
//                       />
//                     </Link>
//                   </div>
//                 );
//               })
//           ) : (
//             // fetchAllowed=true지만, 데이터가 빈 배열
//             <p className="pl-1">근처에 보호 중인 동물이 없습니다.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//

import { useRef } from "react";
import { Link } from "react-router-dom";
import NearbyAnimals from "../../../common/NearbyAnimals";
import AnimalCard from "../../../common/AnimalCard";

interface CardSectionProps {
  title: string;
  cards: number;

  // "User님 근처의 동물" 섹션일 경우에만 쓰이는 props
  animals?: any[]; // 받아온 동물 배열
  isLoading?: boolean;
  isError?: boolean;
  fetchAllowed?: boolean; // 현재 API 호출이 되었는지 여부
  onSearch?: () => void; // 버튼 클릭 시 실행할 함수
}

export default function CardSection({
  title,
  cards,
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
          {/* "동물찾기" 버튼 - animals가 있으면(=근처 동물 섹션) 표시 */}
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
          {/* 
            분기:
            1) "보호중인 동물" 섹션 등 -> animals prop이 없으면 (undefined) -> AnimalCard 반복
            2) "User님 근처의 동물" 섹션 -> animals가 주어지고, fetchAllowed/로딩/에러/데이터 표시
          */}
          {animals === undefined ? (
            /* 보호중인 동물 섹션 (샘플용 AnimalCard) */
            Array(cards)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
                >
                  <Link to={`/AnimalBoard/${index + 1}`}>
                    {/* AnimalCard는 샘플이라 props 없이 사용 */}
                    <AnimalCard />
                  </Link>
                </div>
              ))
          ) : !fetchAllowed ? (
            // "User님 근처의 동물" 섹션인데, 버튼 클릭 전
            <p className="pl-1">버튼을 눌러 내 근처 동물을 찾아보세요!</p>
          ) : isLoading ? (
            // 로딩 중
            <p className="pl-1">불러오는 중...</p>
          ) : isError ? (
            // 에러
            <p className="pl-1">데이터를 가져오는 도중 오류가 발생했습니다.</p>
          ) : animals && animals.length > 0 ? (
            // cards만큼 반복 (근처 동물)
            Array(cards)
              .fill(0)
              .map((_, index) => {
                const animal = animals[index];
                return (
                  <div
                    key={index}
                    className="flex-none pl-1 snap-start w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-[150px] sm:max-w-[256px]"
                  >
                    <Link to={`/AnimalBoard/${animal?.id ?? index + 1}`}>
                      <NearbyAnimals
                        id={animal?.id ?? index}
                        imageUrl={animal?.imageUrl}
                        name={animal?.name ?? "정보 없음"}
                        providerShelterName={animal?.providerShelterName}
                        neuteredStatus={animal?.neuteredStatus}
                        characteristics={animal?.characteristics}
                      />
                    </Link>
                  </div>
                );
              })
          ) : (
            // fetchAllowed=true지만, 빈 배열
            <p className="pl-1">근처에 보호 중인 동물이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
