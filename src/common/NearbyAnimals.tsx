import like from "../assets/icons/like.svg";

export interface AnimalProps {
  id: number;
  imageUrl?: string;
  name: string;
  providerShelterName?: string;
  neuteredStatus?: string;
  characteristics?: string[];
}

// 기존 “년생” 파싱 로직 재활용
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
  //이름에서 나이 추출
  const age = getAgeFromName(name);

  //"YYYY(...)(년생)" 부분을 제거해 "실제 품종/이름"만 남김
  const cleanedName = name.replace(/\s*\d{4}(?:\([^)]*\))*\(년생\)/, "");

  //characteristics에서 성별 추출 ("남"/"여"가 들어 있으면 M/F로)
  let sexCd: "M" | "F" | undefined;
  if (characteristics.includes("남")) {
    sexCd = "M";
  } else if (characteristics.includes("여")) {
    sexCd = "F";
  }

  // characteristics에서 "Kg"가 들어간 문자열을 찾으면 체중으로 사용
  const weight = characteristics.find((item) => item.includes("Kg"));

  return (
    <div
      // key={id}는 보통 부모(map) 쪽에서 설정하지만
      // 여기서도 혹시나 필요하면 둘 수 있음
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
            {sexCd === "M" && " (남아)"}
            {sexCd === "F" && " (여아)"}
          </span>

          <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {providerShelterName ?? "보호소 정보 없음"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {neuteredStatus && (
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
                {neuteredStatus === "Y" ? "중성화 완료" : "중성화 안됨"}
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
