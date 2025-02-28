import React from "react";
import matchingThumnail from "../../assets/images/matchingThumbnail.svg";
import Button from "../../common/ButtonComponent";
import { Link } from "react-router-dom";

export default function Matching() {
  return (
    <div className="flex flex-col items-center text-center my-8">
      <h1 className="font-bold text-[28px] sm:text-[32px] md:text-4xl mb-4 md:mb-6">
        나에게 맞는 애완동물을 같이 찾아보아요!
      </h1>
      <img src={matchingThumnail} alt="매칭썸네일" />
      <p className="mt-5 md:mt-[30px] mb-7 md:mb-10 font-semibold">
        185종의 애완동물 중 나와 어울리는 친구는 누구일까요?
      </p>
      <Link to="/Matching/progress">
        <Button>바로 찾아보기</Button>
      </Link>
    </div>
  );
}
