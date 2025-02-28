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
      className="min-w-[256px] w-full max-w-[256px] bg-white rounded-xl shadow-md flex flex-col"
    >
      <div className="w-full aspect-[16/9] rounded-t-xl overflow-hidden">
        <img
          src={popfile ?? "https://via.placeholder.com/150"}
          alt={kindCd}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-3 py-2 flex-1">
        <span className="block font-semibold text-base mt-3">{kindCd}</span>
        <span className="block font-medium text-sm text-gray-500">
          {careNm ?? "보호소 정보 없음"}
        </span>
        <div className="relative flex gap-2 mt-2">
          {neuterYn && (
            <span className="bg-gray-100 p-1 rounded font-semibold text-xs text-gray-500">
              {neuterYn === "Y" ? "중성화 완료" : "중성화 안됨"}
            </span>
          )}
          {weight && (
            <span className="bg-gray-100 p-1 rounded font-semibold text-xs text-gray-500">
              {weight}
            </span>
          )}
          <img src={like} alt="좋아요" className="absolute bottom-1 right-0" />
        </div>
      </div>
    </div>
  );
}
