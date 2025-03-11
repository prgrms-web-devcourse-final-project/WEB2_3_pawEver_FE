import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

import back from "../../assets/icons/back.svg";
import Button from "../../common/ButtonComponent";
import MatchingOption from "./components/MatchingOption";
import { recommendDog, recommendCat } from "../../api/matchingAnimal";
import { useMatchingStore } from "../../store/matchingStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Answer {
  id: number;
  optionId: number;
  optionText: string;
  questionId: number;
}

interface Question {
  questionId: number;
  questionText: string;
  answers: Answer[];
}

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
  const location = useLocation();
  const [step, setStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [toastActive, setToastActive] = useState<boolean>(false);
  const [toastCount, setToastCount] = useState<number>(0);
  const { userInfo } = useAuthStore();

  const query = new URLSearchParams(location.search);
  const animalType = query.get("type") || "dogs";

  // 모든 질문에 대한 사용자 응답을 저장
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: number; optionId: number }[]
  >([]);

  const fetchQuestion = async () => {
    try {
      const questionId = step + 1;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (userInfo?.accessToken) {
        headers.Authorization = `Bearer ${userInfo.accessToken}`;
      }

      const endpoint =
        animalType === "dogs"
          ? `${API_BASE_URL}/api/recommend-animals/dogs/questions/${questionId}`
          : `${API_BASE_URL}/api/recommend-animals/cats/questions/${questionId}`;

      const response = await axios.get<{
        data: { questionText: string; answers: Answer[] };
      }>(endpoint, {
        headers,
      });

      setQuestion({
        questionId: questionId,
        questionText: response.data.data.questionText,
        answers: response.data.data.answers,
      });

      const previousAnswer = answersHistory.find(
        (answer) => answer.questionId === questionId
      );
      if (previousAnswer) {
        setSelectedOption(previousAnswer.optionId);
      } else {
        setSelectedOption(null);
      }
    } catch (error) {
      console.error("질문 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [step, animalType]);

  const totalSteps = 10;
  const progress = (step / totalSteps) * 100;

  const { setRecommendResult, setAnimalType } = useMatchingStore();

  const handleNext = async () => {
    if (selectedOption === null) {
      if (toastActive || toastCount >= 2) return;
      setToastCount((prev) => prev + 1);
      setToastActive(true);
      toast("질문을 선택해주세요", {
        duration: 2000,
        style: { background: "#09ACFB", color: "#fff" },
        icon: "⚠️",
      });
      setTimeout(() => setToastActive(false), 2000);
      return;
    }

    // 기존 답변 업데이트 또는 새 답변 추가
    const currentQuestionId = question?.questionId ?? 0;
    setAnswersHistory((prev) => {
      // 이미 해당 질문에 대한 응답이 있는지 확인
      const existingAnswerIndex = prev.findIndex(
        (answer) => answer.questionId === currentQuestionId
      );

      if (existingAnswerIndex !== -1) {
        // 기존 응답 업데이트
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          questionId: currentQuestionId,
          optionId: selectedOption,
        };
        return updatedAnswers;
      } else {
        // 새 응답 추가
        return [
          ...prev,
          { questionId: currentQuestionId, optionId: selectedOption },
        ];
      }
    });

    if (step === totalSteps - 1) {
      let response;

      if (animalType === "dogs") {
        const dogResponses = generateDogResponses();
        response = await recommendDog(API_BASE_URL, dogResponses);
      } else {
        response = await recommendCat(API_BASE_URL, answersHistory);
      }

      if ("error" in response) {
        toast("추천 동물을 불러오는 중 오류가 발생했습니다.", {
          duration: 2000,
          style: { background: "#FF5A5F", color: "#fff" },
          icon: "❌",
        });
      } else {
        const responseData = response.data;
        const resultData = Array.isArray(responseData)
          ? responseData[0]
          : responseData;

        setAnimalType(animalType);
        setRecommendResult(resultData);

        toast("추천 동물을 성공적으로 불러왔습니다.", {
          duration: 2000,
          style: { background: "#09ACFB", color: "#fff" },
          icon: "✔️",
        });
        navigate("/Matching/complete");
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const generateDogResponses = () => {
    return answersHistory.map((answer) => ({
      questionId: answer.questionId,
      optionId: answer.optionId,
    }));
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-[1200px] px-4">
          <ProgressBar progress={progress} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-[488px] min-h-[630px] border rounded-xl shadow-xl mx-4 py-6 mt-8 bg-white">
          <button
            onClick={step === 0 ? () => navigate("/Matching") : handlePrev}
            className="inline-flex w-max gap-1 ml-4 items-center"
          >
            <img src={back} alt="이전" />
            <span className="text-[#91989E]">
              {step === 0 ? "돌아가기" : "이전"}
            </span>
          </button>
          <div className="mx-6">
            {question && (
              <>
                <h2 className="font-bold text-[20px] mt-6 mb-2">
                  현재 단계: {step + 1}/{totalSteps}
                </h2>
                <p className="text-[15px] text-[#91989E] mb-10">
                  {question.questionText}
                </p>
                <div className="space-y-6">
                  {question.answers.map((answer) => (
                    <MatchingOption
                      key={answer.optionId}
                      option={answer.optionText}
                      isSelected={selectedOption === answer.optionId}
                      onClick={() => setSelectedOption(answer.optionId)}
                    />
                  ))}
                </div>
              </>
            )}
            <Button className="mt-10 w-full h-12" onClick={handleNext}>
              {step < totalSteps - 1 ? "다음" : "완료"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
