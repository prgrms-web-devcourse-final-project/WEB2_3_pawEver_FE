import { useEffect } from "react";
import UserProfile from "../../components/user/UserProfile";
import UserMenu from "./components/UserMenu";
import { useAnimalLikeStore } from "../../store/animalLikeStore";

export default function Userpage() {
  const { fetchLikedAnimals } = useAnimalLikeStore();

  useEffect(() => {
    fetchLikedAnimals();
  }, [fetchLikedAnimals]);

  return (
    <div className="w-full max-w-[873px] mx-auto">
      <div className="my-10">
        <UserProfile />
      </div>
      <UserMenu />
    </div>
  );
}
