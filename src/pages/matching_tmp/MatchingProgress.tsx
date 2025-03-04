import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  // toast 관련 상태
  const [toastCount, setToastCount] = useState(0);
  const [toastActive, setToastActive] = useState(false);

  const progress = (step / 3) * 100;
  const questionsForStep = matchingQuestions.slice(step * 5, step * 5 + 5);

  const handleNext = () => {
    // 현재 스텝의 5개 질문 중 하나라도 선택되었는지 확인
    const answered = questionsForStep.some((_, index) => {
      const globalIndex = step * 5 + index;
      return !!selectedOptions[globalIndex];
    });
    if (!answered) {
      // toast가 이미 활성화된 상태라면 바로 리턴 (추가 toast 발생 X)
      if (toastActive) return;
      // toast를 최대 2회까지만 보여줌 (이후 toast가 모두 사라질 때까지 버튼 동작 차단)
      if (toastCount < 2) {
        setToastCount((prev) => prev + 1);
        setToastActive(true);
        toast("질문지를 선택해주세요", {
          duration: 2000,
          style: {
            background: "#09ACFB",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "16px",
          },
          icon: "⚠️",
        });
        // toast 표시 기간이 지난 후 상태 초기화
        setTimeout(() => {
          setToastActive(false);
          setToastCount(0);
        }, 2000);
      }
      return;
    }

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
        // 현재 스텝 내 모든 질문 초기화 후 새로운 옵션 선택
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
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-[1200px] px-4">
          <ProgressBar progress={progress} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-[488px] min-h-[630px] md:min-h-[660px] border border-t-1 rounded-xl shadow-xl mx-4 py-6 md:py-8 mt-8 bg-white">
          <button
            type="button"
            className="inline-flex w-max gap-1 ml-4 items-center"
            onClick={step === 0 ? () => navigate("/Matching") : handlePrev}
          >
            <img src={back} alt="이전" />
            <span className="text-[#91989E]">
              {step === 0 ? "돌아가기" : "이전"}
            </span>
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

            <div className="space-y-6">
              {questionsForStep.map(({ option }, index) => {
                const globalIndex = step * 5 + index;
                const isSelected = selectedOptions[globalIndex] === option;

                return (
                  <MatchingOption
                    key={globalIndex}
                    option={option}
                    isSelected={isSelected}
                    onClick={() => handleOptionSelect(index, option)}
                  />
                );
              })}
            </div>

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
