import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getAnimalDetail, {
  AnimalDetailResponse,
} from "../../api/getAnimalDetail";
import Button from "../../common/ButtonComponent";
import LikeIcon from "../../assets/icons/like.svg?react";
import mapMarker from "../../assets/icons/mapMarker.svg";
import exampleAnimal from "../../assets/images/exampleAnimal.png";
import KakaoMap from "../../components/KakaoMap";

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detailData, setDetailData] = useState<AnimalDetailResponse | null>(
    null
  );
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAnimalDetail(+id)
      .then((res) => {
        console.log("동물 상세 응답:", res);
        setDetailData(res);
      })
      .catch((error) => {
        console.error("동물 상세 요청 오류:", error);
      });
  }, [id]);

  if (!detailData) {
    return (
      <div className="p-6">
        <p>Loading...</p>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </div>
    );
  }

  const {
    data: {
      id: detailId,
      imageUrl,
      name,
      neuteredStatus,
      weight,
      color,
      characteristics,
      shelterName,
      shelterPhoneNumber,
      shelterRoadAddress,
      latitude,
      longitude,
    },
  } = detailData;

  // 성별
  let sexText = "미상";
  if (name.includes("남아")) sexText = "남아";
  else if (name.includes("여아")) sexText = "여아";

  // 중성화
  const neuterText =
    neuteredStatus === "Y"
      ? "중성화 완료"
      : neuteredStatus === "N"
      ? "중성화 안됨"
      : "정보 없음";

  // 특징
  const parsedCharacteristics = characteristics
    ? characteristics
        .split(/[.,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : ["정보 없음"];

  const detailRows = [
    { label: "유기번호", value: detailId },
    { label: "중성화 여부", value: neuterText },
    { label: "몸무게", value: weight || "정보 없음" },
    { label: "털색", value: color || "정보 없음" },
  ];

  // 지도 마커
  const hasValidLocation =
    typeof latitude === "number" && typeof longitude === "number";
  const shelterMarkers = hasValidLocation
    ? [
        {
          name: shelterName || "보호소 정보 없음",
          latitude,
          longitude,
          phone: shelterPhoneNumber,
        },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 상단 영역: 이미지 + 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 이미지 영역: 원본 비율 유지를 위해 object-contain */}
        <div className="w-full flex justify-center items-center rounded-lg overflow-hidden">
          <img
            src={imageUrl || exampleAnimal}
            alt="Pet"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* 동물 정보 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
              {name}
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

          <div className="mt-3 space-y-1">
            {detailRows.map(({ label, value }, index) => (
              <p key={index} className="text-gray-600 text-sm">
                {label}: <span className="font-medium">{value}</span>
              </p>
            ))}
          </div>

          <div className="mt-3 border-b border-gray-300 pb-2">
            <p className="text-gray-600 text-sm mb-1 font-medium">특징:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {parsedCharacteristics.map((charItem, idx) => (
                <li key={idx}>{charItem}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-lg font-medium flex items-center">
              📞 보호소 정보
            </h3>
            <p className="text-gray-600 text-sm">
              {shelterName || "정보 없음"}
            </p>
            <p className="text-gray-600 text-sm">
              전화번호:{" "}
              <span className="font-medium">
                {shelterPhoneNumber || "정보 없음"}
              </span>
            </p>
            <p className="text-gray-600 text-sm">
              도로명 주소:{" "}
              <span className="font-medium">
                {shelterRoadAddress || "정보 없음"}
              </span>
            </p>
          </div>

          <div className="mt-4">
            <Button className="bg-main text-white hover:bg-point w-full">
              상담하기
            </Button>
          </div>
        </div>
      </div>

      {/* 하단: 지도 */}
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium flex items-center">
          <img src={mapMarker} className="mr-1" alt="map marker" />
          보호소 위치
        </h3>
        <div className="w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden border border-gray-300">
          <KakaoMap
            width="100%"
            height="100%"
            centerLat={latitude ?? 33.4996}
            centerLng={longitude ?? 126.5312}
            markers={shelterMarkers}
            selectedShelter={null}
          />
        </div>
      </div>
    </div>
  );
}
