import React from "react";
import check from "../../../assets/icons/check.svg";

interface Option {
  option: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function MatchingOption({
  option,
  description,
  isSelected,
  onClick,
}: Option) {
  return (
    <button
      className={`relative flex flex-col mb-2 px-4 gap-1 justify-center text-start w-full max-w-[424px] h-[80px] bg-[#f9fafb] rounded-lg text-[15px] md:text-[16px] ${
        isSelected ? "shadow-lg text-main border border-solid border-main" : ""
      }`}
      onClick={onClick}
    >
      <p className="font-medium">{option}</p>
      {isSelected && (
        <img src={check} alt="선택" className="absolute top-4 right-4" />
      )}

      <p className="text-[#91989E]">{description}</p>
    </button>
  );
}
