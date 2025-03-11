// store/matchingStore.ts
import { create } from "zustand";

interface RecommendResult {
  breedKor: string;
  breedEng: string;
  imageUrl: string;
  lifespan: string;
  temperament: string;
  precaution: string;
}

interface MatchingStore {
  recommendResult: RecommendResult | null;
  animalType: string;
  setRecommendResult: (result: RecommendResult | null) => void;
  setAnimalType: (type: string) => void;
}

export const useMatchingStore = create<MatchingStore>((set) => ({
  recommendResult: null,
  animalType: "dogs",
  setRecommendResult: (result) => set({ recommendResult: result }),
  setAnimalType: (type) => set({ animalType: type }),
}));
