import React from "react";
interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}
declare const Input: React.FC<InputProps>;
export default Input;
