import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimalLikeStore } from "../store/animalLikeStore";
import { useToggleLike } from "../hooks/useToggleLike";
import LikeIcon from "../assets/icons/like.svg?react";

export interface AnimalProps {
  desertionNo: number;
  popfile?: string;
  kindCd: string;
  careNm?: string;
  neuterYn?: string;
  weight?: string;
  sexCd?: string;
}

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

export default function TestCard({
  desertionNo,
  popfile,
  kindCd,
  careNm,
  neuterYn,
  weight,
  sexCd,
}: AnimalProps) {
  const navigate = useNavigate();
  const { likedAnimals } = useAnimalLikeStore();
  const { mutate: toggleLike } = useToggleLike();

  // 좋아요 여부
  const isLiked = likedAnimals.includes(desertionNo);

  // 나이, 이름 정제
  const age = getAgeFromName(kindCd);
  const cleanedName = kindCd.replace(/\s*\d{4}(?:\([^)]*\))*\(년생\)/, "");

  // 카드 전체 클릭 → 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/AnimalBoard/${desertionNo}`);
  };

  // 하트 아이콘 클릭 시 → 낙관적 업데이트
  const handleHeartClick = (e: MouseEvent<HTMLButtonElement>) => {
    // 상위(카드) 클릭 이벤트 전파 방지
    e.preventDefault();
    e.stopPropagation();
    toggleLike(desertionNo);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        w-full
        min-w-[150px]
        max-w-[320px]
        bg-white
        rounded-lg
        shadow-md
        flex
        flex-col
        transition-all
        duration-200
        hover:shadow-lg
        cursor-pointer
      "
    >
      <div className="w-full aspect-video rounded-t-lg overflow-hidden">
        <img
          src={popfile ?? "https://via.placeholder.com/150"}
          alt={cleanedName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <span className="block font-semibold text-sm sm:text-base mt-1 sm:mt-2">
            {cleanedName}
            {sexCd === "M" && " (남아)"}
            {sexCd === "F" && " (여아)"}
          </span>
          <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {careNm ?? "보호소 정보 없음"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {neuterYn && (
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
                {neuterYn === "Y" ? "중성화 완료" : "중성화 안됨"}
              </span>
            )}
            {weight && (
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
                {weight}
              </span>
            )}
            {age && (
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
                {age}
              </span>
            )}
          </div>

          <button
            onClick={handleHeartClick}
            type="button"
            className="
              min-w-[44px]
              min-h-[44px]
              flex
              items-center
              justify-center
              rounded-full
              hover:bg-gray-100
              transition-colors
            "
          >
            <LikeIcon
              className="w-5 h-5"
              fill={isLiked ? "#FF0000" : "none"}
              stroke={isLiked ? "#EF4444" : "currentColor"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
