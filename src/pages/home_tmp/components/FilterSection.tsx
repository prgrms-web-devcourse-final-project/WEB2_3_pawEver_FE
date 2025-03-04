import Dropdown from "../../../common/DropDownComponent";
//
export default function FilterSection() {
  const filters = [
    { label: "동물 구분", options: ["선택하세요", "개", "고양이"] },
    { label: "나이", options: ["선택하세요", "1살 이하", "1~3살", "4살 이상"] },
    { label: "성별", options: ["선택하세요", "수컷", "암컷"] },
    { label: "지역", options: ["선택하세요", "서울", "부산", "대구", "기타"] },
  ];

  return (
    <section className="relative left-1/2 -translate-x-1/2 w-screen bg-gray-50 mb-6 hidden sm:flex h-[8.5rem]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center h-full px-4">
        {filters.map((filter, index) => (
          <div
            key={index}
            className={`w-full sm:max-w-[259px] flex flex-col ${
              index > 0 ? "ml-2" : ""
            }`}
          >
            <p className="text-sm text-[#414651] mb-1">{filter.label}</p>
            <Dropdown options={filter.options} />
          </div>
        ))}
      </div>
    </section>
  );
}
