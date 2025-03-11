import { useState, KeyboardEvent, useEffect } from "react";
import { FilterParams } from "../../../hooks/useFilterAnimals";
import Dropdown from "../../../common/DropDownComponent";

interface FilterAnimalsProps {
  onFilterChange: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

export default function FilterAnimals({
  onFilterChange,
  initialFilters,
}: FilterAnimalsProps) {
  // 종류 필터 (전체, 강아지, 고양이, 기타)
  const [selectedKind, setSelectedKind] = useState<string>(
    mapSpeciesToUI(initialFilters?.species) || "전체"
  );

  // 성별 필터 (전체, 남아, 여아, 기타)
  const [selectedGender, setSelectedGender] = useState<string>(
    mapSexToUI(initialFilters?.sex) || "전체"
  );

  // 나이 필터 (전체, 1살미만, 1살이상~3살이하, 4살이상)
  const [selectedAge, setSelectedAge] = useState<string>(
    mapAgeToUI(initialFilters?.age) || "전체"
  );

  // 검색어
  const [inputValue, setInputValue] = useState<string>(initialFilters?.q || "");
  const [searchValue, setSearchValue] = useState<string>(
    initialFilters?.q || ""
  );

  // UI 선택값 -> API 파라미터 매핑 함수들
  function mapKindToSpecies(kind: string): string {
    switch (kind) {
      case "강아지":
        return "DOG";
      case "고양이":
        return "CAT";
      case "기타":
        return "OTHER";
      default:
        return "";
    }
  }

  function mapGenderToSex(gender: string): string {
    switch (gender) {
      case "남아":
        return "M";
      case "여아":
        return "F";
      default:
        return "";
    }
  }

  function mapAgeToParam(age: string): string {
    switch (age) {
      case "1살미만":
        return "0";
      case "1살이상~3살이하":
        return "1";
      case "4살이상":
        return "2";
      default:
        return "";
    }
  }

  // API 파라미터 -> UI 선택값 매핑 함수들 (초기값 설정용)
  function mapSpeciesToUI(species?: string): string {
    switch (species) {
      case "DOG":
        return "강아지";
      case "CAT":
        return "고양이";
      case "OTHER":
        return "기타";
      default:
        return "전체";
    }
  }

  function mapSexToUI(sex?: string): string {
    switch (sex) {
      case "M":
        return "남아";
      case "F":
        return "여아";
      default:
        return "전체";
    }
  }

  function mapAgeToUI(age?: string): string {
    switch (age) {
      case "0":
        return "1살미만";
      case "1":
        return "1살이상~3살이하";
      case "2":
        return "4살이상";
      default:
        return "전체";
    }
  }

  // 필터 상태를 FilterParams로 변환
  const buildFilterParams = (): FilterParams => {
    return {
      species: mapKindToSpecies(selectedKind),
      sex: mapGenderToSex(selectedGender),
      age: mapAgeToParam(selectedAge),
      q: searchValue || undefined,
    };
  };

  // 필터가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    const filterParams = buildFilterParams();
    onFilterChange(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKind, selectedGender, selectedAge, searchValue]);

  // 검색 버튼 클릭 or 엔터
  const handleSearch = () => {
    setSearchValue(inputValue.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 필터 초기화 함수
  const handleResetFilters = () => {
    setSelectedKind("전체");
    setSelectedGender("전체");
    setSelectedAge("전체");
    setInputValue("");
    setSearchValue("");
  };

  return (
    <div className="bg-[#E5F6FF] w-full rounded-lg p-3 sm:p-4">
      {/* 첫째 줄: 종류 & 성별 & 나이 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-3 sm:mb-4 mt-2 sm:mt-3 px-2 sm:px-4 sm:pl-[86px]">
        {/* 종류 필터 */}
        <div className="flex flex-col w-full sm:w-[130px]">
          <p className="text-sm text-[#414651]">종류</p>
          <Dropdown
            className="text-xs text-[#91989E]"
            options={["전체", "강아지", "고양이", "기타"]}
            value={selectedKind}
            onChange={(val) => setSelectedKind(val)}
          />
        </div>

        {/* 성별 필터 */}
        <div className="flex flex-col w-full sm:w-[130px]">
          <p className="text-sm text-[#414651]">성별</p>
          <Dropdown
            className="text-xs text-[#91989E]"
            options={["전체", "남아", "여아", "기타"]}
            value={selectedGender}
            onChange={(val) => setSelectedGender(val)}
          />
        </div>

        {/* 나이 필터 */}
        <div className="flex flex-col w-full sm:w-[130px]">
          <p className="text-sm text-[#414651]">나이</p>
          <Dropdown
            className="text-xs text-[#91989E]"
            options={["전체", "1살미만", "1살이상~3살이하", "4살이상"]}
            value={selectedAge}
            onChange={(val) => setSelectedAge(val)}
          />
        </div>
      </div>

      {/* 둘째 줄: 검색창 & 버튼 */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pb-2 pt-4 sm:pt-7 px-2 sm:px-4 sm:pl-[86px]">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          className="w-full sm:w-[580px] p-2 border border-[#ccc] rounded-md pr-6 focus:ring-1 focus:ring-main focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-[#009CFF] text-white flex-1 sm:w-[50px] py-2 rounded-md"
            onClick={handleSearch}
          >
            검색
          </button>
          <button
            className="bg-gray-200 text-gray-700 flex-1 sm:w-[80px] py-2 rounded-md hover:bg-gray-300 transition-colors"
            onClick={handleResetFilters}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
