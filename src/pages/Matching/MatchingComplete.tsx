import React from "react";
import back from "../../assets/icons/back.svg";
import walkingdog from "../../assets/images/walkingdog.json";
import Lottie from "lottie-react";

export default function MatchingComplete() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-[488px] h-[630px] md:h-[660px] rounded-xl shadow-lg mx-4 mt-2 py-6 md:py-8">
        <button className="flex gap-1 ml-4 ">
          <img src={back} alt="이전" />
          <div className="text-[#91989E]">이전</div>
        </button>
        <div className="flex flex-col items-center mt-[100px] gap-2 ">
          <Lottie
            animationData={walkingdog}
            loop={true}
            className="w-[200px] h-[200px]"
          />
          <p className="font-bold text-[20px]">접수가 완료되었습니다.</p>
          <p className="text-[15px] text-[#5F656C] text-center">
            당신에게 꼭 맞는 친구들을 찾아 올게요! <br />
            잠시만 기다려 주세요
          </p>
        </div>
      </div>
    </div>
  );
}
