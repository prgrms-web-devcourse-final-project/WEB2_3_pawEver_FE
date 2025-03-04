import React from "react";
interface ButtonProps {
    bgcolor?: string;
    text?: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
