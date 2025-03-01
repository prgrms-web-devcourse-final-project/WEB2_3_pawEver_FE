import like from "../assets/icons/like.svg";

export interface AnimalProps {
  desertionNo: string;
  popfile?: string;
  kindCd: string;
  careNm?: string;
  neuterYn?: string;
  weight?: string;
}

export default function TestCard({
  desertionNo,
  popfile,
  kindCd,
  careNm,
  neuterYn,
  weight,
}: AnimalProps) {
  return (
    <div
      key={desertionNo}
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
      "
    >
      {/* 16:9 비율 유지 */}
      <div className="w-full aspect-video rounded-t-lg overflow-hidden">
        <img
          src={popfile ?? "https://via.placeholder.com/150"}
          alt={kindCd}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 내용 영역 */}
      <div className="p-3 sm:p-4 flex-1">
        <span className="block font-semibold text-sm sm:text-base mt-1 sm:mt-2">
          {kindCd}
        </span>
        <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
          {careNm ?? "보호소 정보 없음"}
        </span>
        <div className="relative flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3 pr-5">
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
          <img
            src={like}
            alt="좋아요"
            className="absolute bottom-0 right-0 w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
}
