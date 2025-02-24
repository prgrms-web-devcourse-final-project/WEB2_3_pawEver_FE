import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder = "placeholder를 입력해주세요",
  value,
  onChange,
  className,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={twMerge(
        `px-4 py-2 rounded-lg border-2 border-main focus:outline-none focus:ring-1 focus:ring-point transition-colors text-base focus:border-point`,
        className
      )}
    />
  );
};

export default Input;
