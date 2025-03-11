import { useEffect, useState } from "react";
import axios from "axios";
import { useMatchingStore } from "../../../store/matchingStore";
import { useAuthStore } from "../../../store/authStore";
import { Link } from "react-router-dom";
import CardSection from "../../home/components/CardSection";

// 주변 추천 동물 응답 항목 타입 정의
type NearbyAnimalItem = {
  imageUrl: string;
  name: string;
  age: string;
  sex: string;
  shelterName: string;
  distanceKm: number;
  id: number;
  characteristics?: string[];
  neuteredStatus?: string;
  providerShelterName?: string;
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
  const getSexSymbol = (sex: string) => {
    return sex === "M" ? "♂" : sex === "F" ? "♀" : "";
  };

  const formatAge = (age: string) => {
    if (age.includes("년생")) {
      const birthYear = parseInt(age.replace(/[^0-9]/g, ""));
      const currentYear = new Date().getFullYear();
      return `${currentYear - birthYear}세`;
    }
    if (age.includes("세")) {
      return age;
    }
    if (!isNaN(Number(age))) {
      return `${age}세`;
    }
    return age;
  };

  const formatName = (name: string) => {
    return name
      .replace(/\s*\d{4}\(년생\)/g, "")
      .split("(")[0]
      .trim();
  };

  return (
    <Link
      to={`/AnimalBoard/${animal.id}`}
      className="relative w-full max-w-[208px] block hover:opacity-95 transition-opacity"
    >
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
        <p className="font-bold text-[18px] my-[2px]">
          {formatName(animal.name)} · {formatAge(animal.age)} ·{" "}
          {getSexSymbol(animal.sex)}
        </p>
        <p className="text-[14px] text-white">
          {animal.shelterName || animal.providerShelterName} ·{" "}
          {animal.distanceKm < 1
            ? `${(animal.distanceKm * 1000).toFixed(0)}m`
            : `${animal.distanceKm.toFixed(1)}km`}
        </p>
      </div>
    </Link>
  );
}

// 위치 정보 동의를 구하는 컴포넌트
function LocationConsentButton({ onConsent }: { onConsent: () => void }) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleLocationRequest = () => {
    setIsRequesting(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsRequesting(false);
          onConsent();
        },
        () => {
          setIsRequesting(false);
          alert("위치 정보를 가져오는데 실패했습니다. 권한을 허용해 주세요.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
      <p className="text-center mb-4">
        내 주변의 동물을 찾으려면 위치 정보 접근 권한이 필요합니다.
      </p>
      <button
        onClick={handleLocationRequest}
        disabled={isRequesting}
        className={`px-4 py-2 rounded text-white font-medium ${
          isRequesting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } transition-colors`}
      >
        {isRequesting ? "처리 중..." : "위치 정보 동의하기"}
      </button>
    </div>
  );
}

// 카드 섹션 구조를 사용한 주변 동물 컴포넌트
export function EnhancedNearbyAnimals() {
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [locationConsent, setLocationConsent] = useState(false);
  const { recommendResult } = useMatchingStore();
  const { userInfo } = useAuthStore();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 위치 정보 동의 처리
  const handleLocationConsent = () => {
    setLocationConsent(true);
  };

  // 위치 정보 동의 후 동물 검색
  useEffect(() => {
    if (locationConsent) {
      fetchNearbyAnimals();
    }
  }, [locationConsent]);

  const fetchNearbyAnimals = async () => {
    if (!recommendResult || !locationConsent) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      let token = userInfo?.accessToken;

      if (!token) {
        try {
          const localUserInfo = JSON.parse(
            localStorage.getItem("userInfo") || "{}"
          );
          token = localUserInfo?.accessToken || "";
        } catch (e) {}
      }

      // 현재 위치 정보 가져오기
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      const requestData = {
        recommendedBreed: recommendResult.breedKor,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
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

      if (response.data.isSuccess && response.data.data) {
        const formattedAnimals = response.data.data.map((animal) => ({
          ...animal,
          providerShelterName: animal.shelterName,
          characteristics: [],
        }));
        setNearbyAnimals(formattedAnimals);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 위치 정보 동의 및 데이터 렌더링 로직
  const renderContent = () => {
    if (!locationConsent) {
      return <LocationConsentButton onConsent={handleLocationConsent} />;
    }

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

    if (isError || nearbyAnimals.length === 0) {
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600 mb-2">
            {`주변 ${recommendResult?.breedKor || ""} 정보를 찾을 수 없습니다.`}
          </p>
          <button
            onClick={fetchNearbyAnimals}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {nearbyAnimals.slice(0, 4).map((animal, index) => (
          <AnimalCard key={index} animal={animal} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-[1.375rem] font-semibold">
          {`${userInfo?.name || "사용자"}님 근처의 ${
            recommendResult?.breedKor || "추천"
          } 동물`}
        </h2>
        {locationConsent && (
          <button
            onClick={fetchNearbyAnimals}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            새로고침
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
}

// CardSection을 활용한 주변 동물 컴포넌트
export function CardSectionNearbyAnimals() {
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [locationConsent, setLocationConsent] = useState(false);
  const { recommendResult } = useMatchingStore();
  const { userInfo } = useAuthStore();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 위치 정보 동의 후 동물 검색
  const handleSearch = () => {
    if (!locationConsent) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationConsent(true);
            fetchNearbyAnimalsWithLocation(position.coords);
          },
          () => {
            alert("위치 정보를 가져오는데 실패했습니다. 권한을 허용해 주세요.");
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      }
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchNearbyAnimalsWithLocation(position.coords);
        },
        () => {
          alert("위치 정보를 가져오는데 실패했습니다. 다시 시도해 주세요.");
        }
      );
    }
  };

  const fetchNearbyAnimalsWithLocation = async (
    coords: GeolocationCoordinates
  ) => {
    if (!recommendResult) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      let token = userInfo?.accessToken;

      if (!token) {
        try {
          const localUserInfo = JSON.parse(
            localStorage.getItem("userInfo") || "{}"
          );
          token = localUserInfo?.accessToken || "";
        } catch (e) {}
      }

      const requestData = {
        recommendedBreed: recommendResult.breedKor,
        latitude: coords.latitude,
        longitude: coords.longitude,
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

      if (response.data.isSuccess && response.data.data) {
        const formattedAnimals = response.data.data.map((animal) => ({
          ...animal,
          providerShelterName: animal.shelterName,
          characteristics: [],
        }));
        setNearbyAnimals(formattedAnimals);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardSection
      title={`${userInfo?.name || "사용자"}님 근처의 ${
        recommendResult?.breedKor || "추천"
      } 동물`}
      cards={4}
      animals={nearbyAnimals}
      isLoading={isLoading}
      isError={isError}
      fetchAllowed={locationConsent}
      onSearch={handleSearch}
    />
  );
}

export default function MatchingCard() {
  const [nearbyAnimals, setNearbyAnimals] = useState<NearbyAnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationConsent, setLocationConsent] = useState(false);
  const { recommendResult } = useMatchingStore();
  const { userInfo } = useAuthStore();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 위치 정보 동의 요청 함수 수정
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationConsent(true);
          fetchNearbyAnimal(position.coords);
        },
        () => {
          setError("위치 정보 접근 권한이 필요합니다.");
        }
      );
    } else {
      setError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  const fetchNearbyAnimal = async (coords: GeolocationCoordinates) => {
    if (!recommendResult) {
      setError("추천 결과 정보가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let token = userInfo?.accessToken;

      const requestData = {
        recommendedBreed: recommendResult.breedKor,
        latitude: coords.latitude,
        longitude: coords.longitude,
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

      if (response.data.isSuccess && response.data.data) {
        setNearbyAnimals(response.data.data);
      } else {
        setError(`API 오류: ${response.data.code}`);
      }
    } catch (err: any) {
      setError(
        `상태 코드 ${err.response?.status || "알 수 없음"}로 요청 실패: ${
          err.response?.data?.code || "알 수 없는 오류"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!locationConsent) {
    return (
      <div className="w-full max-w-[208px] aspect-square rounded-3xl bg-gray-100 flex flex-col items-center justify-center p-3">
        <p className="text-gray-600 text-sm text-center mb-2">
          위치 정보 접근 권한이 필요합니다
        </p>
        <button
          onClick={requestLocationPermission}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          동의하기
        </button>
      </div>
    );
  }

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

  const animal = nearbyAnimals[0];
  return <AnimalCard animal={animal} />;
}
