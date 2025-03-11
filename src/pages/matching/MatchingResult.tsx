import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restart from "../../assets/icons/return.svg";
import share from "../../assets/images/matchingShare.svg";
import urlShare from "../../assets/icons/urlShare.svg";
import kakaotalkShare from "../../assets/icons/kakaotalkShare.svg";
import like from "../../assets/icons/likewhite.svg";
import { EnhancedNearbyAnimals as NearbyAnimals } from "./components/MatchingCard";
import Button from "../../common/ButtonComponent";
import { useMatchingStore } from "../../store/matchingStore";
import { useAuthStore } from "../../store/authStore";

import toast from "react-hot-toast";
import axios from "axios";

// 주변 추천 동물 응답 항목 타입 정의
type NearbyAnimalItem = {
  imageUrl: string;
  name: string;
  age: string;
  sex: string;
  shelterName: string;
  distanceKm: number;
};

export default function MatchingResult() {
  const navigate = useNavigate();
  const { recommendResult, animalType } = useMatchingStore();
  const [loading, setLoading] = useState(true);
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    if (!recommendResult) {
      toast("매칭 결과를 찾을 수 없습니다. 테스트를 다시 시작합니다.", {
        duration: 2000,
        style: { background: "#FF5A5F", color: "#fff" },
        icon: "❌",
      });
      navigate(`/Matching`);
    } else {
      setLoading(false);

      fetchNearbyAnimals();
    }
  }, [recommendResult, navigate]);

  const fetchNearbyAnimals = async () => {
    if (!recommendResult) return;

    setNearbyLoading(true);

    try {
      const token = userInfo?.accessToken || null;

      const requestData = {
        recommendedBreed: recommendResult.breedKor,
      };

      const endpoint = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/recommend-animals/nearby`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await axios.post(endpoint, requestData, {
        headers,
      });

      if (response.data.isSuccess && response.data.data) {
        setNearbyAnimals(response.data.data);
      }
    } catch (err) {
      console.error("주변 동물 정보 가져오기 실패:", err);
    } finally {
      setNearbyLoading(false);
    }
  };

  if (loading || !recommendResult) {
    return (
      <div className="flex justify-center py-10">결과를 불러오는 중...</div>
    );
  }

  const precautionItems = recommendResult.precaution
    ? recommendResult.precaution.split("\n")
    : ["정보가 없습니다."];

  const handleRestartTest = () => {
    navigate(`/Matching?type=${animalType}`);
  };

  const handleUrlShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast("URL이 클립보드에 복사되었습니다.", {
          duration: 2000,
          style: { background: "#09ACFB", color: "#fff" },
          icon: "✔️",
        });
      })
      .catch((err) => {
        console.error("URL 복사 실패:", err);
        toast("URL 복사에 실패했습니다.", {
          duration: 2000,
          style: { background: "#FF5A5F", color: "#fff" },
          icon: "❌",
        });
      });
  };

  const handleKakaoShare = () => {
    toast("카카오톡 공유 기능은 아직 구현되지 않았습니다.", {
      duration: 2000,
      style: { background: "#09ACFB", color: "#fff" },
      icon: "ℹ️",
    });
  };

  const animalTypeText = animalType === "dogs" ? "강아지" : "고양이";

  const renderNearbyAnimals = () => {
    if (nearbyLoading) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-200 animate-pulse"
          ></div>
        ));
    }

    if (nearbyAnimals.length === 0) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-100 flex items-center justify-center"
          >
            <p className="text-gray-500 text-sm text-center px-4">
              주변 {recommendResult.breedKor} 정보가 없습니다.
            </p>
          </div>
        ));
    }

    return nearbyAnimals
      .slice(0, 4)
      .map((animal, index) => <MatchingCardItem key={index} animal={animal} />);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center my-8 w-full max-w-4xl px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-4 w-full">
          <div className="flex flex-col items-center md:justify-center mt-3 w-full">
            <p className="text-[16px] text-[#5F656C]">
              당신에게 가장 잘 어울리는 반려 {animalTypeText}는
            </p>
            <p className="font-bold text-[48px] my-2">
              {recommendResult.breedKor}
            </p>
            <img
              src={recommendResult.imageUrl}
              alt={recommendResult.breedKor}
              className="w-[250px] h-[255px] aspect-auto rounded-xl object-cover"
            />
          </div>
          <div className="w-full max-w-[680px] h-auto min-h-[380px] rounded-2xl border border-[#E1E4E7] text-[14px] px-5 py-8">
            <h3 className="font-semibold text-[#474C53]">수명</h3>
            <p className="text-[#5F656C] mt-1">
              {recommendResult.lifespan || "정보가 없습니다."}
            </p>
            <hr className="my-4 border-gray-300" />

            <h3 className="font-semibold text-[#474C53]">성격</h3>
            <p className="text-[#5F656C] mt-1">
              {recommendResult.temperament || "정보가 없습니다."}
            </p>
            <hr className="my-4 border-gray-300" />

            <h3 className="font-semibold text-[#474C53]">주의사항</h3>
            <ul className="list-disc mt-1 pl-4">
              {precautionItems.map((item, index) => (
                <li key={index} className="mb-2 text-[#5F656C]">
                  {item.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="font-bold text-[20px] mb-1 self-start md:ml-8">
          {recommendResult.breedKor}이(가) 마음에 든다면?
        </p>
        <p className="text-[16px] text-[#5F656C] mb-2 self-start md:ml-8">
          내 근처의 {recommendResult.breedKor}
        </p>

        <div className="flex flex-wrap gap-2 justify-start w-full">
          {nearbyAnimals.length > 0 ? <NearbyAnimals /> : renderNearbyAnimals()}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 mt-9 w-full">
          <Button
            className="w-full md:w-[420px] h-[80px] md:h-[118px]"
            onClick={handleRestartTest}
          >
            <p className="text-[24px] md:text-[32px] mr-2">
              다시 테스트 해보기
            </p>
            <img src={restart} alt="다시시작" />
          </Button>
          <img src={share} alt="매칭결과공유" className="hidden md:block" />
          <div className="flex flex-row md:flex-col gap-2 mt-3">
            <button onClick={handleUrlShare}>
              <img src={urlShare} alt="url 공유" />
            </button>
            <button onClick={handleKakaoShare}>
              <img src={kakaotalkShare} alt="카카오톡 공유" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// MatchingCardItem 컴포넌트 타입 정의
interface MatchingCardItemProps {
  animal: NearbyAnimalItem;
}

// 개별 동물 카드 컴포넌트
function MatchingCardItem({ animal }: MatchingCardItemProps) {
  // 성별 표시를 ♂/♀ 기호로 변환하는 함수
  const getSexSymbol = (sex: string): string => {
    return sex === "M" ? "♂" : sex === "F" ? "♀" : "";
  };

  // 나이 형식 변환 (2024(년생) -> 1세)
  const formatAge = (age: string): string => {
    if (age.includes("년생")) {
      const birthYear = parseInt(age.replace(/[^0-9]/g, ""));
      const currentYear = new Date().getFullYear();
      return `${currentYear - birthYear}세`;
    }
    return age;
  };

  // 동물 이름에서 나이와 성별 정보 제거
  const formatName = (name: string): string => {
    return name.split("(")[0].trim();
  };

  return (
    <div className="relative w-full max-w-[208px]">
      <img
        src={animal.imageUrl}
        alt={`${animal.name} 사진`}
        className="w-full aspect-square rounded-3xl object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/208?text=이미지+없음";
        }}
      />
      <div className="absolute left-3 bottom-[10px] text-white">
        <img src={like} alt="좋아요" />
        <p className="font-bold text-[18px] my-[2px]">
          {formatName(animal.name)} · {formatAge(animal.age)} ·{" "}
          {getSexSymbol(animal.sex)}
        </p>
        <p className="text-[14px] text-[#D6D6D6]">
          {animal.shelterName} ·{" "}
          {animal.distanceKm < 1
            ? `${(animal.distanceKm * 1000).toFixed(0)}m`
            : `${animal.distanceKm.toFixed(1)}km`}
        </p>
      </div>
    </div>
  );
}
