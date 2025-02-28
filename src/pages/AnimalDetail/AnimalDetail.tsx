import React, { useState } from "react";
import KakaoMap from "../../components/KakaoMap";
import exampleAnimal from "../../assets/images/exampleAnimal.png";
import mapMarker from "../../assets/icons/mapMarker.svg";
import ButtonComponent from "../../common/ButtonComponent";
import like from "../../assets/icons/like.svg";

const PetAdoptionCard: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      {/* Image and Info Section */}
      <div className="flex pb-4">
        {/* Left Side - Image */}
        <div className="w-1/2 pr-4 relative">
          <img
            src={exampleAnimal}
            className="rounded-lg w-full h-auto border border-gray-300"
            alt="Pet"
          />
        </div>

        {/* Right Side - Information */}
        <div className="w-1/2 pl-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <h2 className="text-2xl font-semibold">아바시니안 1개월 (남아)</h2>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "bg-red-500" : "bg-gray-500"}
            >
              <img
                src={like}
                alt="Like button"
                className={`w-6 h-6 transition-all duration-300 ${
                  isLiked ? "filter brightness-0 invert" : ""
                }`}
              />
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            유기번호: <span className="font-medium">5461151351</span>
          </p>
          <p className="text-gray-600 text-sm">
            중성화 여부: <span className="font-medium">중성화 완료</span>
          </p>
          <p className="text-gray-600 text-sm">
            몸무게: <span className="font-medium">5kg</span>
          </p>
          <p className="text-gray-600 text-sm">
            털색: <span className="font-medium">흰색/갈색</span>
          </p>
          <p className="text-gray-600 text-sm border-b border-gray-300 pb-2">
            특징: <span className="font-medium">겁이 많음</span>
          </p>

          {/* Shelter Info Now Placed Directly Below Features */}
          <div className="mt-4">
            <h3 className="text-lg font-medium flex items-center">
              📞 보호소 정보
            </h3>
            <p className="text-gray-600 text-sm">제주 동물보호센터</p>
            <p className="text-gray-600 text-sm">
              전화번호: <span className="font-medium">064-710-4065</span>
            </p>
            <p className="text-gray-600 text-sm">
              담당자 전화번호: <span className="font-medium">064-710-4065</span>
            </p>
            <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
          </div>
        </div>
      </div>

      {/* Shelter Address Below Image */}
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium flex items-center">
          <img src={mapMarker} className="mr-1" /> 보호소 주소
        </h3>
        <div className="w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-300">
          <KakaoMap
            centerLat={33.4996}
            centerLng={126.5312}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default PetAdoptionCard;
