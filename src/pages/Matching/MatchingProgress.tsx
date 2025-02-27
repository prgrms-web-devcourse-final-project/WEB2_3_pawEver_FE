import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import back from "../../assets/icons/back.svg";
import Button from "../../common/ButtonComponent";
import MatchingOption from "./components/MatchingOption";
import { matchingQuestions } from "./components/MatchingList";

interface ProgressProps {
  progress: number;
}
const ProgressBar = ({ progress }: ProgressProps) => {
  return (
    <div className="w-full h-2 rounded-md bg-[#F2F4F7]">
      <div
        className="h-full bg-main rounded-md transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default function MatchingProgress() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const progress = (step / 3) * 100;
  const questionsForStep = matchingQuestions.slice(step * 5, step * 5 + 5);
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/Matching/complete");
    }
  };
  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  const handleOptionSelect = (questionIndex: number, newOption: string) => {
    const globalIndex = step * 5 + questionIndex;
    setSelectedOptions((prev) => {
      const newArr = [...prev];
      const currentlySelected = newArr[globalIndex];
      if (currentlySelected === newOption) {
        newArr[globalIndex] = "";
      } else {
        for (let i = step * 5; i < step * 5 + 5; i++) {
          newArr[i] = "";
        }
        newArr[globalIndex] = newOption;
      }
      return newArr;
    });
  };

  return (
    <>
      <ProgressBar progress={progress} />
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-[488px] h-[630px] md:h-[660px] rounded-xl shadow-lg mx-4 py-6 md:py-8">
          <button
            type="button"
            className="inline-flex gap-1 ml-4 items-center"
            onClick={handlePrev}
            disabled={step === 0}
          >
            <img src={back} alt="이전" />
            <span className="text-[#91989E]">이전</span>
          </button>
          <div className="mx-6 md:mx-8">
            <div>
              <h2 className="font-bold text-[20px] mt-6 mb-2">
                {`현재 단계: ${step + 1}/4`}
              </h2>
              <p className="text-[15px] text-[#91989E] mb-10 md:mb-12">
                {`질문 ${step * 5 + 1} ~ ${step * 5 + questionsForStep.length}`}
              </p>
            </div>
            {/* 스텝별 5개 질문 */}
            <div className="space-y-6">
              {questionsForStep.map(({ option, description }, index) => {
                const globalIndex = step * 5 + index;
                const isSelected = selectedOptions[globalIndex] === option;

                return (
                  <MatchingOption
                    key={globalIndex}
                    option={option}
                    description={description}
                    isSelected={isSelected}
                    onClick={() => handleOptionSelect(index, option)}
                  />
                );
              })}
            </div>
            {/* 다음 버튼 */}
            <Button
              className="mt-10 w-full max-w-[424px] h-12"
              onClick={handleNext}
            >
              {step < 3 ? "다음" : "완료"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
