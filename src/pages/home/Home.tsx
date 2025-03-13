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
    <div className="max-w-screen-xl mx-auto flex flex-col gap-8 overflow-x-hidden">
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
