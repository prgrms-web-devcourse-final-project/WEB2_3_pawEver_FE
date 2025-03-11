import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import arrowIcon from "../assets/icons/arrow.svg";

interface DropdownProps {
  options: string[];
  width?: number;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  width,
  className,
  value,
  defaultValue,
  onChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 내부에서 관리할 선택 상태 (Uncontrolled 시에만 사용)
  const [internalValue, setInternalValue] = useState<string>(() => {
    return defaultValue ?? options[0] ?? "";
  });

  // 실제로 렌더링할 "표시 텍스트": Controlled vs Uncontrolled
  const displayValue = value !== undefined ? value : internalValue;

  // 드롭다운 열기/닫기
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // 항목 선택 시 처리
  const handleSelect = (selectedOption: string) => {
    // 만약 Controlled 모드(value prop 있음)라면, 내부 state를 바꾸지 않고 onChange만 호출
    if (value === undefined) {
      // Uncontrolled 모드라면 내부 state 업데이트
      setInternalValue(selectedOption);
    }

    // 부모에 알림
    onChange?.(selectedOption);

    // 드롭다운 닫기
    setIsOpen(false);
  };

  // 드롭다운 영역 밖을 클릭 시 닫힘 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative border-[1px] hover:border-main bg-white rounded-lg"
      style={{ width: width ? `${width}px` : undefined }}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className={twMerge(
          `px-4 py-2 w-full text-left text-base focus:outline-none`,
          className
        )}
      >
        {displayValue}
        <img
          src={arrowIcon}
          alt="arrow"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border-[1px] border-main bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
