import Input from "../../common/InputComponent";
import Dropdown from "../../common/DropDownComponent";
import Button from "../../common/ButtonComponent";
import KakaoMap from "../../components/KakaoMap";
import Planner from "../../assets/icons/Planner.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useEffect, useState } from "react";

// window.kakao에 대한 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

export default function EditReservation() {
  const handleSubmit = () => {
    console.log("예약 정보 제출");
  };

  return <EditReservationPresenter onSubmit={handleSubmit} />;
}

interface Shelter {
  name: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
}

interface EditReservationPresenterProps {
  onSubmit: () => void;
}

function EditReservationPresenter({ onSubmit }: EditReservationPresenterProps) {
  const [reservationDate, setReservationDate] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.5665,
    longitude: 126.978,
  });
  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) {
      setReservationDate(date[0]); // 첫 번째 날짜만 선택
      console.log("선택된 날짜:", date[0].toISOString().split("T")[0]);
    } else {
      setReservationDate(date);
      console.log("선택된 날짜:", date.toISOString().split("T")[0]);
    }
  };

  // 검색된 보호소 목록
  const [shelterOptions, setShelterOptions] = useState<Shelter[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<string>("");

  // 브라우저 Geolocation API로 사용자의 현재 위치 가져오기
  useEffect(() => {
    setUserLocation({ latitude: 37.5665, longitude: 126.978 });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          // 실패 시 서울 중심 좌표 유지
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10초
          maximumAge: 0,
        }
      );
    } else {
      console.error("브라우저가 Geolocation을 지원하지 않습니다.");
    }
  }, []);

  //다중 키워드로 보호소 검색
  useEffect(() => {
    if (!userLocation) return;

    // 카카오맵 API가 로드되었는지 확인하는 함수
    const loadKakaoMapAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          resolve();
        } else {
          const checkInterval = setInterval(() => {
            if (
              window.kakao &&
              window.kakao.maps &&
              window.kakao.maps.services
            ) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 300);
        }
      });
    };

    // 키워드
    const keywords = [
      "동물보호센터",
      "유기동물 보호소",
      "유기동물 보호센터",
      "유기견 보호소",
      "입양",
    ];

    const searchShelters = async () => {
      try {
        await loadKakaoMapAPI();
        const placesService = new window.kakao.maps.services.Places();

        let combinedShelters: Shelter[] = [];

        // 키워드 배열을 순회하며 순차적으로 검색
        for (const keyword of keywords) {
          await new Promise<void>((resolve) => {
            placesService.keywordSearch(
              keyword,
              (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const shelters = result.map((place: any) => ({
                    name: place.place_name,
                    latitude: parseFloat(place.y),
                    longitude: parseFloat(place.x),
                    phone: place.phone,
                    distance: place.distance
                      ? parseInt(place.distance, 10)
                      : undefined,
                  }));
                  // 기존 목록과 합치기
                  combinedShelters = combinedShelters.concat(shelters);
                } else {
                  console.error(
                    `키워드 "${keyword}" 검색 실패. status:`,
                    status
                  );
                }
                resolve();
              },
              {
                location: new window.kakao.maps.LatLng(
                  userLocation.latitude,
                  userLocation.longitude
                ),
                // radius 늘리면 오류나옴
                radius: 15000,
              }
            );
          });
        }

        // 중복 제거
        const uniqueShelters = removeDuplicateShelters(combinedShelters);

        setShelterOptions(uniqueShelters);
      } catch (error) {
        console.error("보호소 검색 중 오류 발생:", error);
      }
    };

    searchShelters();
  }, [userLocation]);

  // 중복 제거 로직 (이름, 좌표 기반 예시)
  const removeDuplicateShelters = (list: Shelter[]): Shelter[] => {
    const seen = new Map<string, Shelter>();
    list.forEach((shelter) => {
      const key = `${shelter.name}_${shelter.latitude}_${shelter.longitude}`;
      if (!seen.has(key)) {
        seen.set(key, shelter);
      }
    });
    return Array.from(seen.values());
  };

  // Dropdown에서 보호소 선택했을 때
  const handleShelterSelect = (value: string) => {
    setSelectedShelter(value);
    console.log("선택된 보호소:", value);
  };

  // 선택된 보호소 데이터(없으면 사용자 위치)
  const selectedShelterObject =
    shelterOptions.find((oneShelter) => oneShelter.name === selectedShelter) ||
    null;

  // 지도 초기 중심: 선택된 보호소 없으면 userLocation
  const centerLat = selectedShelterObject
    ? selectedShelterObject.latitude
    : userLocation.latitude;
  const centerLng = selectedShelterObject
    ? selectedShelterObject.longitude
    : userLocation.longitude;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* 왼쪽 컬럼 */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              제목 <span className="text-red-500">*</span>
            </p>
            <Input placeholder="입력해주세요" className="h-10 w-[400px]" />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              신청 유형 선택 <span className="text-red-500">*</span>
            </p>
            <Dropdown
              options={["방문 예약", "입양 상담", "봉사 활동"]}
              onSelect={(value) => console.log(value)}
              width={400}
              className="h-10"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              이름 <span className="text-red-500">*</span>
            </p>
            <Input placeholder="입력해주세요" className="h-10 w-[400px]" />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </p>
            <Input placeholder="입력해주세요" className="h-10 w-[400px]" />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              날짜 예약 <span className="text-red-500">*</span>
            </p>
            <Input
              placeholder="YYYY-MM-DD"
              className="h-10 w-full pr-10"
              value={
                reservationDate
                  ? reservationDate.toISOString().split("T")[0]
                  : ""
              }
            />
            <Calendar
              onChange={handleDateChange}
              value={reservationDate}
              className="mt-2 border border-gray-300 rounded-md shadow-md"
              tileClassName={({ date }) =>
                reservationDate &&
                date.toDateString() === reservationDate.toDateString()
                  ? "bg-main text-white rounded-lg"
                  : ""
              }
            />
          </div>

          <div className="flex gap-2">
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              09:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              10:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              11:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              12:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              13:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              14:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              15:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              16:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              17:00
            </Button>
            <Button
              bgcolor="white"
              text="black"
              className="border-[1px] font-medium"
            >
              18:00
            </Button>
          </div>

          {/* 이부분에 캘린더 만들어줘 */}

          <div>
            <p className="text-sm text-gray-500 mb-1">
              보호소 선택하기 <span className="text-red-500">*</span>
            </p>
            <Dropdown
              options={shelterOptions.map((item) => item.name)}
              onSelect={handleShelterSelect}
              width={400}
              className="h-10"
            />
            <div className="mt-4 w-full h-64 border border-gray-300 rounded-md">
              <KakaoMap
                width="100%"
                height="100%"
                centerLat={37.452327}
                centerLng={126.653208}
                markers={[
                  {
                    name: "한국동물보호소협회",
                    latitude: 37.5422976,
                    longitude: 127.0939648,
                    phone: "032-XXX-XXXX",
                    distance: 1500,
                  },
                ]}
                selectedShelter={{
                  name: "한국동물보호소협회",
                  latitude: 37.5422976,
                  longitude: 127.0939648,
                  phone: "032-XXX-XXXX",
                  distance: 1.5,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center mt-10">
        <Button onClick={onSubmit} className="px-10 py-2">
          제출하기
        </Button>
      </div>
    </div>
  );
}
