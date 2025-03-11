import { useEffect, useState } from "react";
import Button from "../../../common/ButtonComponent";
import { useNavigate } from "react-router-dom";
import catimg1 from "../../../assets/images/catimg1.jpg";
import catimg2 from "../../../assets/images/catimg2.jpg";
import dogimg1 from "../../../assets/images/dogimg1.jpg";
import dogimg2 from "../../../assets/images/dogimg2.jpg";

export default function DonationSection() {
  const navigate = useNavigate();
  const images = [catimg1, dogimg1, catimg2, dogimg2];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentImage * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="입양 동물"
            className="w-full h-64 object-cover flex-shrink-0"
          />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 text-white bg-black bg-opacity-40">
        <h1 className=" text-[28px] md:text-4xl font-semibold md:font-bold">
          새로운 시작을 선물해주세요!
        </h1>
        <p className="mt-2 text-base md:text-lg">
          <span className="block sm:inline"> 당신의 관심이 </span> 아이들에게
          따뜻한 보금자리가 됩니다.
        </p>
        <Button
          className="mt-4 border-none font-medium"
          onClick={() => navigate("/Donation")}
        >
          후원하기
        </Button>
      </div>
    </div>
  );
}
