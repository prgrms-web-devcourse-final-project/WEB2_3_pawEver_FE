import like from "../assets/icons/like.svg";

export default function AnimalCard() {
  return (
    <div className="w-full min-w-[150px] max-w-[320px] bg-white rounded-lg shadow-md flex flex-col transition-all duration-200 hover:shadow-lg">
      {/* 16:9 비율 유지 */}
      <div className="w-full aspect-video rounded-t-lg overflow-hidden">
        <img
          src="https://i.pinimg.com/474x/a9/7c/8c/a97c8ce8286ae5852ab017ad0a81c605.jpg"
          alt="보호 동물 사진"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 내용  */}
      <div className="p-3 sm:p-4 flex-1">
        <span className="block font-semibold text-sm sm:text-base mt-1 sm:mt-2">
          말티즈 2개월 (남아)
        </span>
        <span className="block font-medium text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
          성동 보호소
        </span>
        <div className="relative flex gap-2 mt-3">
          <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
            중성화 완료
          </span>
          <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs text-gray-500">
            1kg
          </span>
          {/* 좋아요  */}
          <img
            src={like}
            alt="좋아요"
            className="absolute bottom-1 right-0 w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
}
