import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import arrowIcon from "../assets/icons/arrow.svg";

interface DropdownProps {
  options: string[];
  width?: number;
  onSelect?: (value: string) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  width,
  onSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0] || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect && onSelect(value);
    setIsOpen(false);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative border-2 border-main rounded-lg"
      style={{ width: width ? `${width}px` : undefined }}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={twMerge(
          `px-4 py-2 focus:outline-none text-base w-full text-left`,
          className
        )}
      >
        {selected}
        <img
          src={arrowIcon}
          alt="arrow"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border-2 border-main rounded-lg shadow-lg max-h-60 overflow-auto">
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
