import { useEffect, useState } from "react";
import axios from "axios";
import like from "../../../assets/icons/likewhite.svg";
import { useMatchingStore } from "../../../store/matchingStore";
import { useAuthStore } from "../../../store/authStore";

// 주변 추천 동물 응답 항목 타입 정의
type NearbyAnimalItem = {
  imageUrl: string;
  name: string;
  age: string;
  sex: string;
  shelterName: string;
  distanceKm: number;
};

// 주변 추천 동물 API 응답 타입 정의
type NearbyAnimalsResponse = {
  isSuccess: boolean;
  status: string;
  code: string;
  data: NearbyAnimalItem[];
};

// 각 동물 카드를 렌더링하는 컴포넌트
function AnimalCard({ animal }: { animal: NearbyAnimalItem }) {
  // 성별 표시를 ♂/♀ 기호로 변환하는 함수
  const getSexSymbol = (sex: string) => {
    return sex === "M" ? "♂" : sex === "F" ? "♀" : "";
  };

  // 나이 형식 변환 (2024(년생) -> 1세)
  const formatAge = (age: string) => {
    if (age.includes("년생")) {
      const birthYear = parseInt(age.replace(/[^0-9]/g, ""));
      const currentYear = new Date().getFullYear();
      return `${currentYear - birthYear}세`;
    }
    return age;
  };

  // 동물 이름에서 나이와 성별 정보 제거
  const formatName = (name: string) => {
    return name.split("(")[0].trim();
  };

  return (
    <div className="relative w-full max-w-[208px]">
      <img
        src={animal.imageUrl}
        alt={`${animal.name} 사진`}
        className="w-full aspect-square rounded-3xl object-cover"
        onError={(e) => {
          e.currentTarget.src =
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

// MatchingCard 컴포넌트 - 이제 여러 동물 데이터를 가져와서 부모 컴포넌트에 제공
export default function MatchingCard() {
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zustand 스토어에서 추천 결과 가져오기
  const { recommendResult } = useMatchingStore();
  const { userInfo } = useAuthStore();

  // API 기본 URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNearbyAnimals = async () => {
      if (!recommendResult) {
        setError("추천 결과 정보가 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // authStore에서 토큰 가져오기 (스토어에 없을 경우 로컬 스토리지에서 시도)
        let token = userInfo?.accessToken;

        // 스토어에 토큰이 없으면 로컬 스토리지에서 시도
        if (!token) {
          try {
            const localUserInfo = JSON.parse(
              localStorage.getItem("userInfo") || "{}"
            );
            token = localUserInfo?.accessToken || "";
          } catch (e) {
            console.error(
              "로컬 스토리지에서 유저 정보를 가져오는 중 오류 발생:",
              e
            );
          }
        }

        // 추천 품종 정보를 포함한 요청 데이터 준비
        const requestData = {
          recommendedBreed: recommendResult.breedKor,
        };

        // 백엔드 API 요청 방식에 맞게 POST 요청으로 변경
        const endpoint = `${API_BASE_URL}/api/recommend-animals/nearby`;

        const response = await axios.post<NearbyAnimalsResponse>(
          endpoint,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        console.log("주변 추천 동물 API 응답:", response.data);

        if (response.data.isSuccess && response.data.data) {
          setNearbyAnimals(response.data.data);
        } else {
          setError(`API 오류: ${response.data.code}`);
        }
      } catch (err: any) {
        console.error(
          "API 요청 실패:",
          err.response?.status,
          err.response?.data
        );
        setError(
          `상태 코드 ${err.response?.status || "알 수 없음"}로 요청 실패: ${
            err.response?.data?.code || "알 수 없는 오류"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyAnimals();
  }, [recommendResult, userInfo]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-200 animate-pulse"></div>
    );
  }

  if (error || nearbyAnimals.length === 0) {
    return (
      <div className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm text-center px-4">
          {error || `주변 ${recommendResult?.breedKor || ""} 정보가 없습니다.`}
        </p>
      </div>
    );
  }

  // 첫 번째 동물만 표시 (이 부분을 수정해야 합니다)
  const animal = nearbyAnimals[0];
  return <AnimalCard animal={animal} />;
}

// 새롭게 추가하는 컴포넌트 - 모든 동물 데이터를 표시
export function NearbyAnimals() {
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zustand 스토어에서 추천 결과 가져오기
  const { recommendResult } = useMatchingStore();
  const { userInfo } = useAuthStore();

  // API 기본 URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNearbyAnimals = async () => {
      if (!recommendResult) {
        setError("추천 결과 정보가 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let token = userInfo?.accessToken;

        if (!token) {
          try {
            const localUserInfo = JSON.parse(
              localStorage.getItem("userInfo") || "{}"
            );
            token = localUserInfo?.accessToken || "";
          } catch (e) {
            console.error(
              "로컬 스토리지에서 유저 정보를 가져오는 중 오류 발생:",
              e
            );
          }
        }

        const requestData = {
          recommendedBreed: recommendResult.breedKor,
        };

        const endpoint = `${API_BASE_URL}/api/recommend-animals/nearby`;

        const response = await axios.post<NearbyAnimalsResponse>(
          endpoint,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        console.log("주변 추천 동물 API 응답:", response.data);

        if (response.data.isSuccess && response.data.data) {
          setNearbyAnimals(response.data.data);
        } else {
          setError(`API 오류: ${response.data.code}`);
        }
      } catch (err: any) {
        console.error(
          "API 요청 실패:",
          err.response?.status,
          err.response?.data
        );
        setError(
          `상태 코드 ${err.response?.status || "알 수 없음"}로 요청 실패: ${
            err.response?.data?.code || "알 수 없는 오류"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyAnimals();
  }, [recommendResult, userInfo]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-200 animate-pulse"
            ></div>
          ))}
      </div>
    );
  }

  if (error || nearbyAnimals.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-100 flex items-center justify-center"
            >
              <p className="text-gray-500 text-sm text-center px-4">
                {error ||
                  `주변 ${recommendResult?.breedKor || ""} 정보가 없습니다.`}
              </p>
            </div>
          ))}
      </div>
    );
  }

  // 모든 동물 표시 (최대 4개)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {nearbyAnimals.slice(0, 4).map((animal, index) => (
        <AnimalCard key={index} animal={animal} />
      ))}
    </div>
  );
}
