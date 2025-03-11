// import like from "../assets/icons/like.svg";

// export interface AnimalProps {
//   id: number;
//   imageUrl?: string;
//   name: string;
//   providerShelterName?: string;
//   neuteredStatus?: string;
//   characteristics?: string[];
// }

// // 기존 “년생” 파싱 로직 재활용
// const getAgeFromName = (name: string): string | null => {
//   const currentYear = new Date().getFullYear();
//   const regex = /(\d{4})(?:\([^)]*\))*\(년생\)/;
//   const match = name.match(regex);
//   if (match && match[1]) {
//     const birthYear = parseInt(match[1], 10);
//     const age = currentYear - birthYear;
//     return `${age}살`;
//   }
//   return null;
// };

// export default function NearbyAnimals({
//   id,
//   imageUrl,
//   name,
//   providerShelterName,
//   neuteredStatus,
//   characteristics = [],
// }: AnimalProps) {
//   // 이름에서 나이 추출
//   const age = getAgeFromName(name);

//   // "YYYY(...)(년생)" 부분을 제거해 실제 이름만 남기고 양쪽 공백 제거
//   const cleanedName = name.replace(/\s*\d{4}(?:\([^)]*\))*\(년생\)/, "").trim();

//   // cleanedName에 이미 성별 표시가 포함되어 있는지 확인
//   const genderAlreadyDisplayed =
//     cleanedName.includes("(남아)") ||
//     cleanedName.includes("(여아)") ||
//     cleanedName.includes("(성별 미상)");

//   // characteristics에서 성별 정보 결정
//   let genderDisplay = "";
//   if (characteristics.includes("(성별 미상)")) {
//     genderDisplay = " (성별 미상)";
//   } else if (characteristics.includes("남")) {
//     genderDisplay = " (남아)";
//   } else if (characteristics.includes("여")) {
//     genderDisplay = " (여아)";
//   }

//   // characteristics에서 "Kg"가 들어간 문자열을 찾아 체중으로 사용
//   const weight = characteristics.find((item) => item.includes("Kg"));

//   return (
//     <div
//       className="
//         w-full
//         min-w-[150px] sm:min-w-[200px] md:min-w-[250px] lg:min-w-[300px]
//         lg:max-w-[300px]
//         bg-white
//         rounded-lg
//         shadow-md
//         flex
//         flex-col
//         transition-all
//         duration-200
//         hover:shadow-lg
//       "
//     >
//       {/* 16:9 비율 이미지 영역 */}
//       <div className="w-full aspect-video rounded-t-lg overflow-hidden">
//         <img
//           src={imageUrl ?? "https://via.placeholder.com/150"}
//           alt={cleanedName}
//           className="w-full h-full object-cover"
//           loading="lazy"
//         />
//       </div>

//       {/* 내용 영역 */}
//       <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
//         <div>
//           <span className="block font-semibold text-sm sm:text-base mt-1 sm:mt-2">
//             {cleanedName}
//             {!genderAlreadyDisplayed && genderDisplay}
//           </span>
//           <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
//             {providerShelterName ?? "보호소 정보 없음"}
//           </span>
//         </div>

//         <div className="flex items-center justify-between mt-2">
//           <div className="flex flex-wrap gap-1 sm:gap-2">
//             {neuteredStatus && (
//               <span className="whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
//                 {neuteredStatus === "Y" ? "중성화 완료" : "중성화 안됨"}
//               </span>
//             )}
//             {weight && (
//               <span className="hidden sm:inline whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
//                 {weight}
//               </span>
//             )}
//             {age && (
//               <span className="whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
//                 {age}
//               </span>
//             )}
//           </div>
//           <img src={like} alt="좋아요" className="w-4 h-4 flex-shrink-0" />
//         </div>
//       </div>
//     </div>
//   );
// }

import { MouseEvent } from "react";
import { useAnimalLikeStore } from "../store/animalLikeStore";
import { useToggleLike } from "../hooks/useToggleLike";
import LikeIcon from "../assets/icons/like.svg?react";

export interface AnimalProps {
  id: number;
  imageUrl?: string;
  name: string;
  providerShelterName?: string;
  neuteredStatus?: string;
  characteristics?: string[];
}

// 기존 "년생" 파싱 로직 재활용
const getAgeFromName = (name: string): string | null => {
  const currentYear = new Date().getFullYear();
  const regex = /(\d{4})(?:\([^)]*\))*\(년생\)/;
  const match = name.match(regex);
  if (match && match[1]) {
    const birthYear = parseInt(match[1], 10);
    const age = currentYear - birthYear;
    return `${age}살`;
  }
  return null;
};

export default function NearbyAnimals({
  id,
  imageUrl,
  name,
  providerShelterName,
  neuteredStatus,
  characteristics = [],
}: AnimalProps) {
  // Zustand 스토어에서 좋아요 상태 가져오기
  const { likedAnimals } = useAnimalLikeStore();
  const { mutate: toggleLike } = useToggleLike();

  // 좋아요 여부 확인
  const isLiked = likedAnimals.includes(id);

  // 이름에서 나이 추출
  const age = getAgeFromName(name);

  // "YYYY(...)(년생)" 부분을 제거해 실제 이름만 남기고 양쪽 공백 제거
  const cleanedName = name.replace(/\s*\d{4}(?:\([^)]*\))*\(년생\)/, "").trim();

  // cleanedName에 이미 성별 표시가 포함되어 있는지 확인
  const genderAlreadyDisplayed =
    cleanedName.includes("(남아)") ||
    cleanedName.includes("(여아)") ||
    cleanedName.includes("(성별 미상)");

  // characteristics에서 성별 정보 결정
  let genderDisplay = "";
  if (characteristics.includes("(성별 미상)")) {
    genderDisplay = " (성별 미상)";
  } else if (characteristics.includes("남")) {
    genderDisplay = " (남아)";
  } else if (characteristics.includes("여")) {
    genderDisplay = " (여아)";
  }

  // characteristics에서 "Kg"가 들어간 문자열을 찾아 체중으로 사용
  const weight = characteristics.find((item) => item.includes("Kg"));

  // 하트 아이콘 클릭 시 → 낙관적 업데이트
  const handleHeartClick = (e: MouseEvent<HTMLButtonElement>) => {
    // 상위 이벤트 전파 방지
    e.preventDefault();
    e.stopPropagation();

    // 좋아요 토글
    toggleLike(id);
  };

  return (
    <div
      className="
        w-full
        min-w-[150px] sm:min-w-[200px] md:min-w-[250px] lg:min-w-[300px]
        lg:max-w-[300px]
        bg-white
        rounded-lg
        shadow-md
        flex
        flex-col
        transition-all
        duration-200
        hover:shadow-lg
      "
    >
      {/* 16:9 비율 이미지 영역 */}
      <div className="w-full aspect-video rounded-t-lg overflow-hidden">
        <img
          src={imageUrl ?? "https://via.placeholder.com/150"}
          alt={cleanedName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 내용 영역 */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <span className="block font-semibold text-sm sm:text-base mt-1 sm:mt-2">
            {cleanedName}
            {!genderAlreadyDisplayed && genderDisplay}
          </span>
          <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {providerShelterName ?? "보호소 정보 없음"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {neuteredStatus && (
              <span className="whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
                {neuteredStatus === "Y" ? "중성화 완료" : "중성화 안됨"}
              </span>
            )}
            {weight && (
              <span className="hidden sm:inline whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
                {weight}
              </span>
            )}
            {age && (
              <span className="whitespace-nowrap bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-[0.65rem] sm:text-xs text-gray-500">
                {age}
              </span>
            )}
          </div>
          <button
            onClick={handleHeartClick}
            type="button"
            className="
              min-w-[36px]
              min-h-[36px]
              flex
              items-center
              justify-center
              rounded-full
              hover:bg-gray-100
              transition-colors
            "
          >
            <LikeIcon
              className="w-4 h-4"
              fill={isLiked ? "#FF0000" : "none"}
              stroke={isLiked ? "#EF4444" : "currentColor"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
