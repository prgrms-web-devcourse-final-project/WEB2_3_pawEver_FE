import HeroSection from "./components/HeroSection";
import FilterSection from "./components/FilterSection";
import CardSection from "./components/CardSection";

export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      <HeroSection />
      <FilterSection />
      <CardSection title="보호중인 동물" cards={9} />
      <div className="mt-8">
        <CardSection title="User님 근처의 동물" cards={5} />
      </div>
    </div>
  );
}
