import like from "../assets/icons/like.svg";

export default function AnimalCard() {
  return (
    <div className="min-w-[256px] w-full max-w-[256px] bg-white rounded-xl shadow-md flex flex-col">
      <div className="w-full aspect-[16/9] rounded-t-xl overflow-hidden">
        <img
          src="https://i.pinimg.com/474x/a9/7c/8c/a97c8ce8286ae5852ab017ad0a81c605.jpg"
          alt="보호 동물 사진"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-3 py-2 flex-1">
        <span className="block font-semibold text-base mt-3">
          말티즈 2개월 (남아)
        </span>
        <span className="block font-medium text-sm text-gray-500">
          성동 보호소
        </span>
        <div className="relative flex gap-2 mt-2">
          <span className="bg-gray-100 p-1 rounded font-semibold text-xs text-gray-500">
            중성화 완료
          </span>
          <span className="bg-gray-100 p-1 rounded font-semibold text-xs text-gray-500">
            1kg
          </span>
          <img src={like} alt="좋아요" className="absolute bottom-1 right-0" />
        </div>
      </div>
    </div>
    </div>
  );
}
