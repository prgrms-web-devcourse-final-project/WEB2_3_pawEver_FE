// import { useState } from "react";
// import { useAuthStore } from "../../store/authStore";
// import HeroSection from "./components/HeroSection";
// import FilterSection from "./components/FilterSection";
// import CardSection from "./components/CardSection";
// import useNearbyAnimals from "../../hooks/useNearbyAnimals";
// import useProtectedAnimals from "../../hooks/useProtectedAnimals";

// export default function Home() {
//   const [fetchAllowed, setFetchAllowed] = useState(false);

//   const { userInfo } = useAuthStore();
//   const userName = userInfo?.name || "게스트";
//   const {
//     data: protectedData,
//     isLoading: isProtectedLoading,
//     isError: isProtectedError,
//   } = useProtectedAnimals({}, 4);

//   // 근처 동물 데이터 (강아지+고양이 병합)
//   const { data: nearbyAnimals, isError: isNearbyError } =
//     useNearbyAnimals(fetchAllowed);
//   return (
//     <div className="flex flex-col justify-center">
//       <HeroSection />
//       <FilterSection />
//       {/* 보호중인 동물 섹션 */}
//       <CardSection
//         title="보호중인 동물"
//         cards={20}
//         protectedAnimals={protectedData?.animals}
//         isProtectedLoading={isProtectedLoading}
//         isProtectedError={isProtectedError}
//       />
//       <div className="mt-8">
//         {/* 근처 동물 섹션 */}
//         <CardSection
//           title={`${userName}님 근처의 동물`}
//           cards={10}
//           animals={nearbyAnimals}
//           isError={isNearbyError}
//           fetchAllowed={fetchAllowed}
//           onSearch={() => setFetchAllowed(true)}
//         />
//       </div>
//     </div>
//   );
// }

//체크중

// import { useState, useEffect } from "react";
// import HeroSection from "./components/HeroSection";
// import FilterSection from "./components/FilterSection";
// import CardSection from "./components/CardSection";
// import useNearbyAnimals from "../../hooks/useNearbyAnimals";
// import useProtectedAnimals from "../../hooks/useProtectedAnimals";
// import { useAuthStore } from "../../store/authStore";
// import toast from "react-hot-toast";

// export default function Home() {
//   const [fetchAllowed, setFetchAllowed] = useState(false);
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
//     null
//   );

//   // useAuthStore에서 사용자 정보 가져오기
//   const { userInfo } = useAuthStore();

//   // 사용자 이름 표시를 위한 변수 - 사용자 정보가 없으면 '게스트'로 표시
//   const userName = userInfo?.name || "게스트";

//   // 보호중인 동물 데이터 - 4페이지 데이터 가져오기 (총 20마리)
//   const {
//     data: protectedData,
//     isLoading: isProtectedLoading,
//     isError: isProtectedError,
//   } = useProtectedAnimals({}, 4);

//   // 근처 동물 데이터 (강아지+고양이 병합) - 위치 정보 전달
//   const {
//     data: nearbyAnimals,
//     isLoading: isNearbyLoading,
//     isError: isNearbyError,
//     error: nearbyError,
//   } = useNearbyAnimals(fetchAllowed);

//   // 에러 메시지 확인 및 표시
//   useEffect(() => {
//     if (isNearbyError && nearbyError) {
//       toast.error(`근처 동물 데이터 로딩 오류: ${nearbyError.message}`);
//       console.error("근처 동물 데이터 오류:", nearbyError);
//     }
//   }, [isNearbyError, nearbyError]);

//   // 사용자 위치 정보 가져오기
//   const getUserLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("브라우저가 위치 정보를 지원하지 않습니다.");
//       return;
//     }

//     const loadingToast = toast.loading("위치 정보를 가져오는 중...");

//     navigator.geolocation.getCurrentPosition(
//       // 성공 콜백
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         // 위치 정보를 상태에 저장하고 콘솔에 로그 출력
//         console.log("위치 정보 획득 성공:", { latitude, longitude });
//         setLocation({ lat: latitude, lng: longitude });
//         setFetchAllowed(true);

//         toast.dismiss(loadingToast);
//         toast.success("위치 정보를 성공적으로 가져왔습니다!");
//       },
//       // 실패 콜백
//       (error) => {
//         toast.dismiss(loadingToast);

//         let errorMessage = "위치 정보를 가져오는 데 실패했습니다.";
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = "위치 정보를 사용할 수 없습니다.";
//             break;
//           case error.TIMEOUT:
//             errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
//             break;
//         }

//         console.error("위치 정보 획득 실패:", errorMessage, error);
//         toast.error(errorMessage);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   };

//   // 동물찾기 버튼 클릭 핸들러
//   const handleSearchClick = () => {
//     getUserLocation();
//   };

//   // 에러 처리
//   useEffect(() => {
//     if (isProtectedError) {
//       toast.error("보호중인 동물 데이터를 불러오는 중 오류가 발생했습니다.");
//     }
//   }, [isProtectedError]);

//   return (
//     <div className="flex flex-col justify-center">
//       <HeroSection />
//       <FilterSection />

//       {/* 보호중인 동물 섹션 */}
//       <CardSection
//         title="보호중인 동물"
//         cards={20}
//         protectedAnimals={protectedData?.animals}
//         isProtectedLoading={isProtectedLoading}
//         isProtectedError={isProtectedError}
//       />

//       <div className="mt-8">
//         {/* 근처 동물 섹션 - 동적 사용자 이름 적용 */}
//         <CardSection
//           title={`${userName}님 근처의 동물`}
//           cards={10}
//           animals={nearbyAnimals}
//           isLoading={isNearbyLoading}
//           isError={isNearbyError}
//           fetchAllowed={fetchAllowed}
//           onSearch={handleSearchClick}
//         />
//       </div>
//     </div>
//   );
// }

//반응형디자인

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import HeroSection from "./components/HeroSection";
import CardSection from "./components/CardSection";
import useNearbyAnimals from "../../hooks/useNearbyAnimals";
import useProtectedAnimals from "../../hooks/useProtectedAnimals";
import DonationSection from "./components/DonationSection";

export default function Home() {
  const [fetchAllowed, setFetchAllowed] = useState(false);

  const { userInfo } = useAuthStore();
  const userName = userInfo?.name || "게스트";
  const {
    data: protectedData,
    isLoading: isProtectedLoading,
    isError: isProtectedError,
  } = useProtectedAnimals({}, 4);

  // 근처 동물 데이터 (강아지+고양이 병합)
  const { data: nearbyAnimals, isError: isNearbyError } =
    useNearbyAnimals(fetchAllowed);

  return (
    <div className="max-w-screen-xl mx-auto px-4 flex flex-col gap-8 overflow-x-hidden">
      <HeroSection />
      <DonationSection />
      <CardSection
        title="보호중인 동물"
        cards={20}
        protectedAnimals={protectedData?.animals}
        isProtectedLoading={isProtectedLoading}
        isProtectedError={isProtectedError}
      />
      <CardSection
        title={`${userName}님 근처의 동물`}
        cards={10}
        animals={nearbyAnimals}
        isError={isNearbyError}
        fetchAllowed={fetchAllowed}
        onSearch={() => setFetchAllowed(true)}
      />
    </div>
  );
}
