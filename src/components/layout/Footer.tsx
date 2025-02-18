import React from "react";
import logo from "../assets/icons/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 h-[140px] bottom-0 w-full text-left px-[170px] flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="logo" className="pr-2" />
        <span className="text-lg font-bold">PAWEVER</span>
      </div>
      <ul className="flex flex-wrap items-start space-x-4 text-sm text-gray-600">
        <li>
          <a href="#" className="hover:underline">
            회사 소개
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            고객센터
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            이용약관
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            블로그
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            개인정보 처리방침
          </a>
        </li>
      </ul>
      <div className="text-left text-xs text-gray-500">
        서울시 강남구 테헤란로 123-45, 3층 | 전화번호: 02-1234-5678
      </div>
    </footer>
  );
};

export default Footer;
