import { useState } from "react";
import HeroSection from "./components/HeroSection";
import FilterSection from "./components/FilterSection";
import CardSection from "./components/CardSection";
import useNearbyAnimals from "../../hooks/useNearbyAnimals";

export default function Home() {
  const [fetchAllowed, setFetchAllowed] = useState(false);
  const { data, isLoading, isError } = useNearbyAnimals(fetchAllowed);
  return (
    <div className="flex flex-col justify-center">
      <HeroSection />
      <FilterSection />

      <CardSection title="보호중인 동물" cards={9} />

      <div className="mt-8">
        {/* CardSection이 User님 근처의 동물 + 버튼 + data 렌더 */}
        <CardSection
          title="User님 근처의 동물"
          cards={10}
          animals={data}
          isLoading={isLoading}
          isError={isError}
          fetchAllowed={fetchAllowed}
          onSearch={() => setFetchAllowed(true)}
        />
      </div>
    </div>
  );
}
