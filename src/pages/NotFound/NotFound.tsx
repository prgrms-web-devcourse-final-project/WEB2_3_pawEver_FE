import React from "react";
import { useNavigate } from "react-router-dom";
import notFoundImg from "../../assets/images/notFoundImg.png";
import ButtonComponent from "../../common/ButtonComponent";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-center flex flex-col items-center">
        <img src={notFoundImg} className="mx-auto mb-4" alt="Not Found" />
        <p className="text-lg text-gray-700 mb-4">잘못된 페이지입니다!</p>
        <ButtonComponent className="mx-auto" onClick={() => navigate("/")}>
          홈으로 이동하기
        </ButtonComponent>
      </div>
    </div>
  );
}
