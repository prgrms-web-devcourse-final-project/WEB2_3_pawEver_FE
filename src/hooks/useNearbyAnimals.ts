import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export default function useNearbyAnimals(enabled: boolean) {
  // 인증 상태 및 토큰을 Zustand 스토어에서 가져옴
  const { userInfo } = useAuthStore.getState();

  const fetchNearbyAnimals = async () => {
    // 토큰이 없으면 오류 발생
    if (!userInfo?.accessToken) {
      throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
    }

    // 실제 API 호출
    const [dogRes, catRes] = await Promise.all([
      fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/dogs?page=0",
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      ),
      fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/cats?page=0",
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
          },
        }
      ),
    ]);

    if (!dogRes.ok) throw new Error("Failed to fetch dogs");
    if (!catRes.ok) throw new Error("Failed to fetch cats");

    const dogData = await dogRes.json();
    const catData = await catRes.json();

    const dogList = dogData?.data?.content ?? [];
    const catList = catData?.data?.content ?? [];

    return [...dogList, ...catList];
  };

  // 여기서 enabled를 받아서 제어
  // isLoggedIn 상태를 추가로 확인하여 로그인되어 있을 때만 API 호출
  const { isLoggedIn } = useAuthStore.getState();

  return useQuery({
    queryKey: ["nearbyAnimals"],
    queryFn: fetchNearbyAnimals,
    // 버튼 클릭 전에는 쿼리 비활성화 + 로그인 상태 확인
    enabled: enabled && isLoggedIn,
    retry: 1, // 실패 시 1번만 재시도
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 캐싱
  });
}

//위치 받아내기

// import { useQuery } from "@tanstack/react-query";
// import { useAuthStore } from "../store/authStore";

// // 위도와 경도를 매개변수로 추가
// export default function useNearbyAnimals(
//   enabled: boolean,
//   latitude?: number,
//   longitude?: number
// ) {
//   // 인증 상태 및 토큰을 Zustand 스토어에서 가져옴
//   const { userInfo } = useAuthStore.getState();
//   const { isLoggedIn } = useAuthStore.getState();

//   const fetchNearbyAnimals = async () => {
//     // 토큰이 없으면 오류 발생
//     if (!userInfo?.accessToken) {
//       throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
//     }

//     // 위치 정보가 없으면 오류 발생
//     if (latitude === undefined || longitude === undefined) {
//       throw new Error("위치 정보가 없습니다.");
//     }

//     // 위치 정보를 쿼리 파라미터에 포함
//     const dogUrl = new URL(
//       import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/dogs"
//     );
//     dogUrl.searchParams.append("page", "0");
//     dogUrl.searchParams.append("lat", latitude.toString());
//     dogUrl.searchParams.append("lng", longitude.toString());

//     const catUrl = new URL(
//       import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/cats"
//     );
//     catUrl.searchParams.append("page", "0");
//     catUrl.searchParams.append("lat", latitude.toString());
//     catUrl.searchParams.append("lng", longitude.toString());

//     // 실제 API 호출
//     const [dogRes, catRes] = await Promise.all([
//       fetch(dogUrl.toString(), {
//         headers: {
//           Authorization: `Bearer ${userInfo.accessToken}`,
//         },
//       }),
//       fetch(catUrl.toString(), {
//         headers: {
//           Authorization: `Bearer ${userInfo.accessToken}`,
//         },
//       }),
//     ]);

//     if (!dogRes.ok) throw new Error("Failed to fetch dogs");
//     if (!catRes.ok) throw new Error("Failed to fetch cats");

//     const dogData = await dogRes.json();
//     const catData = await catRes.json();

//     const dogList = dogData?.data?.content ?? [];
//     const catList = catData?.data?.content ?? [];

//     return [...dogList, ...catList];
//   };

//   return useQuery({
//     queryKey: ["nearbyAnimals", latitude, longitude], // 위치 정보를 queryKey에 포함
//     queryFn: fetchNearbyAnimals,
//     // 위치 정보가 있고, enabled가 true이고, 로그인 상태일 때만 API 호출
//     enabled:
//       enabled &&
//       isLoggedIn &&
//       latitude !== undefined &&
//       longitude !== undefined,
//     retry: 1,
//     staleTime: 5 * 60 * 1000,
//   });
// }
