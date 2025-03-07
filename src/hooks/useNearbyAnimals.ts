import { useQuery } from "@tanstack/react-query";

export default function useNearbyAnimals(enabled: boolean) {
  const fetchNearbyAnimals = async () => {
    // 실제 API 호출
    const [dogRes, catRes] = await Promise.all([
      fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/dogs?page=0",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
        }
      ),
      fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/animals/nearby/cats?page=0",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
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
  return useQuery({
    queryKey: ["nearbyAnimals"],
    queryFn: fetchNearbyAnimals,
    // 버튼 클릭 전에는 쿼리 비활성
    enabled,
  });
}
