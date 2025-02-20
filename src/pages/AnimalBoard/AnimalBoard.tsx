import { useState } from "react";
import Dropdown from "../../common/DropDownComponent";
import AnimalCard from "../../common/AnimalCard";
import board_sliders from "../../assets/icons/board-sliders.svg";

export default function AnimalBoard({ cards = 80 }) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const filters = [
    { label: "축종", options: ["선택하세요", "개", "고양이", "기타"] },
    { label: "품종", options: ["선택하세요", "소형", "중형", "대형"] },
    { label: "성별", options: ["선택하세요", "수컷", "암컷"] },
  ];

  const animalData = {
    id: 1,
    name: "말티즈 2개월 (남아)",
    shelter: "성동 보호소",
    imageUrl:
      "https://i.pinimg.com/474x/a9/7c/8c/a97c8ce8286ae5852ab017ad0a81c605.jpg",
  };

  const repeatedAnimalData = Array(cards).fill(animalData);

  return (
    <div className="w-full max-w-[930px] mx-auto px-4">
      <div className="flex items-center justify-between mt-10 mb-1">
        <p className="text-xl font-semibold">보호 중인 동물</p>
        <img
          src={board_sliders}
          alt="필터 아이콘"
          className="w-5 h-5 cursor-pointer"
          onClick={toggleFilters}
        />
      </div>

      {showFilters && (
        <div className="bg-[#E5F6FF] w-full rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 mt-3 px-4 sm:pl-[86px]">
            {filters.map((filter, index) => (
              <div key={index} className="flex flex-col w-full sm:w-[130px]">
                <p className="text-sm text-[#414651]">{filter.label}</p>
                <Dropdown
                  className="text-xs text-[#91989E]"
                  options={filter.options}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-7 px-4 sm:pl-[86px]">
            <input
              type="text"
              placeholder="강아지를 입력해주세요."
              className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6"
            />
            <button className="bg-[#009CFF] text-white w-full sm:w-[50px] py-2 rounded-md">
              검색
            </button>
          </div>
        </div>
      )}

      <div className="mt-7 grid grid-cols-1 min-[480px]:grid-cols-2 min-[730px]:grid-cols-3 xl:grid-cols-4 gap-4">
        {repeatedAnimalData.map((animal, index) => (
          <div key={index} className="flex justify-center">
            <AnimalCard />
          </div>
        ))}
      </div>
    </div>
  );
}
