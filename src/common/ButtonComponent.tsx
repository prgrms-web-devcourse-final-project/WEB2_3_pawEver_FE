import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  bgcolor?: string;
  text?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  bgcolor = "bg-main",
  text = "text-white",
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        `px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center border-solid border-2 hover:bg-point`,
        `${bgcolor} ${text}`
      )}
    >
      {children}
    </button>
  );
};

export default Button;
