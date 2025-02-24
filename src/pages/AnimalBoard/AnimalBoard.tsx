import { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "../../common/DropDownComponent";
import AnimalCard from "../../common/AnimalCard";
import board_sliders from "../../assets/icons/board-sliders.svg";

export default function AnimalBoard() {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const filters = [
    { label: "축종", options: ["선택하세요", "개", "고양이", "기타"] },
    { label: "품종", options: ["선택하세요", "소형", "중형", "대형"] },
    { label: "성별", options: ["선택하세요", "수컷", "암컷"] },
  ];

  // 임시 데이터: 실제는 각 카드에 고유 id가 포함된 데이터를 사용
  const cards = new Array(12).fill(null).map((_, index) => ({
    id: index + 1,
  }));

  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto">
        {" "}
        <div className="flex items-center justify-between mt-10 mb-1">
          <p className="text-xl font-semibold mb-1">보호 중인 동물</p>
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
        <div
          className="grid gap-4 mt-7 mx-auto w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 256px)",
            justifyContent: "center",
            maxWidth: "1200px", // 또는 원하는 최대 너비
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.id}
              to={`/AnimalBoard/${card.id}`}
              className="w-full"
            >
              <div className="w-[256px]">
                <AnimalCard />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
