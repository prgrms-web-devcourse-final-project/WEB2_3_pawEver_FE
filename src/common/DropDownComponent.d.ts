import React from "react";
interface DropdownProps {
    options: string[];
    width?: number;
    onSelect?: (value: string) => void;
    className?: string;
}
declare const Dropdown: React.FC<DropdownProps>;
export default Dropdown;
