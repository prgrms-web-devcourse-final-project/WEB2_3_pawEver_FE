import { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import KakaoMap from "../../components/KakaoMap";
import Button from "../../common/ButtonComponent";
import LikeIcon from "../../assets/icons/like.svg?react";
import mapMarker from "../../assets/icons/mapMarker.svg";
import exampleAnimal from "../../assets/images/exampleAnimal.png";
import type { AnimalsResponse } from "../../api/fetchAnimals";

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const animalsInfiniteData = queryClient.getQueryData<
    InfiniteData<AnimalsResponse>
  >(["animalsList"]);

  const allAnimals = useMemo(() => {
    if (!animalsInfiniteData) return [];
    return animalsInfiniteData.pages.flatMap(
      (page) => page.response?.body?.items?.item ?? []
    );
  }, [animalsInfiniteData]);

  const animal = allAnimals.find((item: any) => item.desertionNo === id);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!animal) {
    return (
      <div className="p-6">
        <p>Animal not found.</p>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </div>
    );
  }

  const sexText =
    animal.sexCd === "M" ? "남아" : animal.sexCd === "F" ? "여아" : "미상";
  const neuterText =
    animal.neuterYn === "Y"
      ? "중성화 완료"
      : animal.neuterYn === "N"
      ? "중성화 안됨"
      : "정보 없음";

  const detailRows = [
    { label: "유기번호", value: animal.desertionNo, extra: "mt-1" },
    { label: "중성화 여부", value: neuterText },
    { label: "몸무게", value: animal.weight || "정보 없음" },
    { label: "털색", value: animal.colorCd || "정보 없음" },
    {
      label: "특징",
      value: animal.specialMark || "없음",
      extra: "border-b border-gray-300 pb-2",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 반응형: 모바일은 세로 배치, md 이상에서는 가로 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {/* 이미지 컨테이너 */}
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg border border-gray-300">
          <img
            src={animal.popfile || exampleAnimal}
            alt="Pet"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 오른쪽 설명 박스 */}
        <div className="w-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {animal.kindCd} {animal.age} ({sexText})
              </h2>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <LikeIcon
                  className="w-6 h-6"
                  fill={isLiked ? "#FF0000" : "none"}
                  stroke={isLiked ? "#EF4444" : "currentColor"}
                />
              </button>
            </div>
            <div className="mt-2">
              {detailRows.map(({ label, value, extra }, index) => (
                <p
                  key={index}
                  className={`text-gray-600 text-sm ${
                    extra ? extra : index === 0 ? "mt-1" : ""
                  }`}
                >
                  {label}: <span className="font-medium">{value}</span>
                </p>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium flex items-center">
                📞 보호소 정보
              </h3>
              <p className="text-gray-600 text-sm">
                {animal.careNm || "정보 없음"}
              </p>
              <p className="text-gray-600 text-sm">
                전화번호:{" "}
                <span className="font-medium">
                  {animal.careTel || "정보 없음"}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                담당자 전화번호:{" "}
                <span className="font-medium">
                  {animal.officetel || "정보 없음"}
                </span>
              </p>
            </div>
          </div>
          {/* 상담하기 버튼을 하단에 고정 */}
          <div className="mt-4">
            <Button className="w-40 bg-main text-white hover:bg-point">
              상담하기
            </Button>
          </div>
        </div>
      </div>

      {/* 보호소 지도 */}
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium flex items-center">
          <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
        </h3>
        <div className="w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden border border-gray-300">
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
}
