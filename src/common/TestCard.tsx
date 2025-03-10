import like from "../assets/icons/like.svg";

export interface AnimalProps {
  desertionNo: number;
  popfile?: string;
  kindCd: string; // 예: "믹스견 2021(년생) (여아)" 또는 "한국 고양이 2025(60일미만)(년생) (여아)"
  careNm?: string;
  neuterYn?: string;
  weight?: string;
  sexCd?: string;
}

const getAgeFromName = (name: string): string | null => {
  const currentYear = new Date().getFullYear();
  // 4자리 연도 뒤에 0개 이상의 괄호 그룹이 나오고, 마지막에 (년생)으로 끝나는 패턴
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
  const age = getAgeFromName(kindCd);
  // "YYYY(...)(년생)" 부분(앞의 공백 포함)을 제거
  const cleanedName = kindCd.replace(/\s*\d{4}(?:\([^)]*\))*\(년생\)/, "");

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
          alt={cleanedName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 내용 영역: flex-col + justify-between */}
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
          <img src={like} alt="좋아요" className="w-4 h-4 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
