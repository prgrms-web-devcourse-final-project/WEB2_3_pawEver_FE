import React from "react";
import ButtonComponent from "../common/ButtonComponent";
import InputComponent from "../common/InputComponent";
import DropDownComponent from "../common/DropDownComponent";
import logo from "../assets/icons/logo.svg";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 flex items-center justify-between p-4 md:px-[170px] shadow-md bg-white z-50">
      <div className="flex items-center space-x-[64px]">
        <div className="cursor-pointer font-bold flex hover:text-main">
          <img
            src={logo}
            alt="logo"
            onClick={() => navigate("/")}
            className="pr-2"
          />
          PAWEVER
        </div>

        <nav className="hidden md:flex space-x-6 text-base font-medium">
          <a href="#" className="hover:text-main">
            입양동물찾기
          </a>
          <a href="#" className="hover:text-main">
            커뮤니티
          </a>
          <a href="#" className="hover:text-main">
            예약/상담
          </a>
          <a href="#" className="hover:text-main">
            즐겨찾기
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ButtonComponent bgcolor="bg-main">로그인</ButtonComponent>
        {/* <InputComponent width={400}></InputComponent> */}
        {/* <DropDownComponent width={200} options={["123", "456"]}></DropDownComponent> */}
      </div>
    </header>
  );
};

export default Header;
