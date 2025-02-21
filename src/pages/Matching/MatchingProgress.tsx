import React, { useState } from "react";
import MatchingOption from "./components/MatchingOption";
import Button from "../../common/ButtonComponent";
import back from "../../assets/icons/back.svg";

interface Progress {
  progress: number;
}
const ProgressBar = ({ progress }: Progress) => {
  return (
    <div className="w-full h-2 rounded-md bg-[#F2F4F7]">
      <div
        className={`h-full bg-main rounded-md transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
export default function MatchingProgress() {
  const list = [
    {
      option: "저는 산책을 자주 나갑니다.",
      description: "부가설명",
    },
    { option: "저는 산책을 자주 안 나갑니다.", description: "부가설명" },
    { option: "저는 산책을 종종 나갑니다.", description: "부가설명" },
    { option: "저는 산책을 종종 나갑니다.", description: "부가설명" },
  ];

  const [progress, setProgress] = useState(0);
  const increaseProgress = () => {
    setProgress((prev) => (prev < 100 ? prev + 20 : 100));
  };

  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <>
      <ProgressBar progress={progress} />
      <div className="flex justify-center ">
        <div className="flex flex-col w-full max-w-[488px] h-[630px] md:h-[660px] rounded-xl shadow-lg mx-4 py-6 md:py-8">
          <button className="flex gap-1 ml-4 ">
            <img src={back} alt="이전" />
            <div className="text-[#91989E]">이전</div>
          </button>
          <div className="mx-6 md:mx-8">
            <div>
              <h2 className="font-bold text-[20px] mt-6 mb-2 ">
                성격이 활발하고 자주 산책을 다니시나요?
              </h2>
              <p className="text-[15px] text-[#91989E] mb-10 md:mb-12">
                산책은~~
              </p>
            </div>
            <div>
              {list.map(({ option, description }, index) => (
                <MatchingOption
                  key={index}
                  option={option}
                  description={description}
                  isSelected={selectedOption === option}
                  onClick={() => setSelectedOption(option)}
                />
              ))}
            </div>
            <Button
              className="mt-10 w-full max-w-[424px] h-12"
              onClick={increaseProgress}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
