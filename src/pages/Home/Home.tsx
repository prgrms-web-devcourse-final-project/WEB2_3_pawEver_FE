// import { useRef } from "react";
// import main_img from "../../assets/images/main_img.png";
// import Dropdown from "../../common/DropDownComponent";
// import AnimalCard from "../../common/AnimalCard";

// interface CardSectionProps {
//   title: string;
//   cards: number;
// }

// const CardSection = ({ title, cards }: CardSectionProps) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const scroll = (direction: "left" | "right") => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({
//         left: direction === "left" ? -200 : 200,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <p className="font-semibold text-[1.375rem]">{title}</p>
//         <div className="flex items-center">
//           <p className="font-semibold text-base text-gray-400">전체보기</p>
//           <div className="hidden sm:flex items-center ml-2 w-[61px] h-[28px] rounded-lg border border-gray-300">
//             <button
//               onClick={() => scroll("left")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">{"<"}</span>
//             </button>
//             <div className="w-[1px] h-full bg-gray-300"></div>
//             <button
//               onClick={() => scroll("right")}
//               className="w-1/2 h-full text-gray-300 flex items-center justify-center"
//             >
//               <span className="text-[1.125rem]">{">"}</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="w-full overflow-hidden">
//         <div
//           ref={containerRef}
//           className="h-[290px] flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             WebkitOverflowScrolling: "touch",
//           }}
//         >
//           {Array(cards)
//             .fill(0)
//             .map((_, index) => (
//               <div key={index} className="flex-none snap-start">
//                 <AnimalCard />
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Home() {
//   const filters = [
//     { label: "동물 구분", options: ["선택하세요", "개", "고양이"] },
//     { label: "나이", options: ["선택하세요", "1살 이하", "1~3살", "4살 이상"] },
//     { label: "성별", options: ["선택하세요", "수컷", "암컷"] },
//     { label: "지역", options: ["선택하세요", "서울", "부산", "대구", "기타"] },
//   ];

//   return (
//     <div className="flex flex-col justify-center">
//       <section className="bg-[#E3F6FF] mt-6 mb-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 py-12 sm:py-14 rounded-lg relative">
//         <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
//           <p className="text-[1.375rem] sm:text-[1.625rem] md:text-[1.75rem] font-semibold leading-snug">
//             나에게 맞는 입양동물이
//             <br className="hidden sm:block" />
//             궁금하다면?
//           </p>
//           <button className="mt-4 w-full sm:w-auto px-4 py-2 bg-[#09ACFB] text-white rounded-lg hover:bg-blue-600">
//             찾아보기
//           </button>
//         </div>
//         <img
//           src={main_img}
//           alt="Main Image"
//           className="w-full sm:w-[420px] mt-4 sm:mt-0"
//         />
//       </section>
//       <section className="relative left-1/2 -translate-x-1/2 w-screen bg-gray-50 mb-6 hidden sm:flex h-[8.5rem]">
//         <div className="w-full max-w-[1200px] mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center h-full px-4">
//           {filters.map((filter, index) => (
//             <div
//               key={index}
//               className={`w-full sm:max-w-[259px] flex flex-col ${
//                 index > 0 ? "ml-2" : ""
//               }`}
//             >
//               <p className="text-sm text-[#414651]">{filter.label}</p>
//               <Dropdown options={filter.options} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Card Sections */}
//       <CardSection title="보호중인 동물" cards={9} />
//       <div className="mt-8">
//         <CardSection title="User님 근처의 동물" cards={5} />
//       </div>
//     </div>
//   );
// }

import { useRef } from "react";
import main_img from "../../assets/images/main_img.png";
import Dropdown from "../../common/DropDownComponent";
import AnimalCard from "../../common/AnimalCard";
import { Link } from "react-router-dom";

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-[1.375rem]">{title}</p>
        <div className="flex items-center">
          <p className="font-semibold text-base text-gray-400">전체보기</p>
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
                <Link to={`/AnimalBoard/${index + 1}`}>
                  <AnimalCard />
                </Link>
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
      <section className="bg-[#E3F6FF] mt-6 mb-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 py-12 sm:py-14 rounded-lg relative">
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
          <p className="text-[1.375rem] sm:text-[1.625rem] md:text-[1.75rem] font-semibold leading-snug">
            나에게 맞는 입양동물이
            <br className="hidden sm:block" />
            궁금하다면?
          </p>
          <button className="mt-4 w-full sm:w-auto px-4 py-2 bg-[#09ACFB] text-white rounded-lg hover:bg-blue-600">
            찾아보기
          </button>
        </div>
        <img
          src={main_img}
          alt="Main Image"
          className="w-full sm:w-[420px] mt-4 sm:mt-0"
        />
      </section>
      <section className="relative left-1/2 -translate-x-1/2 w-screen bg-gray-50 mb-6 hidden sm:flex h-[8.5rem]">
        <div className="w-full max-w-[1200px] mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center h-full px-4">
          {filters.map((filter, index) => (
            <div
              key={index}
              className={`w-full sm:max-w-[259px] flex flex-col ${
                index > 0 ? "ml-2" : ""
              }`}
            >
              <p className="text-sm text-[#414651] mb-1">{filter.label}</p>
              <Dropdown options={filter.options} />
            </div>
          ))}
        </div>
      </section>

      {/* Card Sections */}
      <CardSection title="보호중인 동물" cards={9} />
      <div className="mt-8">
        <CardSection title="User님 근처의 동물" cards={5} />
      </div>
    </div>
  );
}
