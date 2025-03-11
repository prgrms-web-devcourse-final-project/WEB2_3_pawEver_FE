import matchingThumbnail from "../../assets/images/matchingThumbnail.svg";
import Button from "../../common/ButtonComponent";
import { useNavigate } from "react-router-dom";

export default function Matching() {
  const navigate = useNavigate();

  const handleDogMatching = () => {
    navigate("/Matching/progress?type=dogs");
  };

  const handleCatMatching = () => {
    navigate("/Matching/progress?type=cats");
  };

  return (
    <div className="flex flex-col items-center text-center my-8">
      <h1 className="font-bold text-[28px] sm:text-[32px] md:text-4xl mb-4 md:mb-6">
        나에게 맞는 애완동물을 같이 찾아보아요!
      </h1>
      <img src={matchingThumbnail} alt="매칭썸네일" />
      <p className="mt-5 md:mt-[30px] mb-7 md:mb-10 font-semibold">
        185종의 애완동물 중 나와 어울리는 친구는 누구일까요?
      </p>
      <div className="flex flex-col gap-4 w-full max-w-[200px]">
        <Button onClick={handleDogMatching} className="w-full">
          강아지 찾아보기
        </Button>
        <Button onClick={handleCatMatching} className="w-full">
          고양이 찾아보기
        </Button>
      </div>
    </div>
  );
}
