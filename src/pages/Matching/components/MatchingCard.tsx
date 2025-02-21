import React from "react";
import like from "../../../assets/icons/likewhite.svg";

export default function MatchingCard() {
  return (
    <div className="relative w-full max-w-[208px]">
      <img
        src="https://i.pinimg.com/236x/a6/62/97/a66297f582ca56f7b47f1a82b824eb24.jpg"
        alt="보호 동물 사진"
        className="w-full aspect-square rounded-3xl object-cover"
      />
      <div className="absolute left-3 bottom-[10px] text-white">
        <img src={like} alt="좋아요" />
        <p className="font-bold text-[18px] my-[2px]">이누 · 3세 · ♂</p>
        <p className="text-[14px] text-[#D6D6D6]">성동보호소 · 1km</p>
      </div>
    </div>
  );
}
