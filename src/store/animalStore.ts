// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { Animal } from "../api/fetchAnimals";

// interface AnimalStore {
//   animals: Animal[];
//   setAnimals: (animals: Animal[]) => void;
// }

// export const useAnimalStore = create<
//   AnimalStore,
//   [["zustand/persist", AnimalStore]]
// >(
//   persist(
//     (set) => ({
//       animals: [],
//       setAnimals: (animals: Animal[]) => set({ animals }),
//     }),
//     {
//       name: "animal-storage",
//     }
//   )
// );

// animalStore.ts 가장 괜찮은버전

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Animal } from "../api/fetchAnimals";
import type { InfiniteData } from "@tanstack/react-query";

// 주어진 API 응답 타입
import type { AnimalsResponse } from "../api/fetchAnimals";

interface AnimalStore {
  // animals: Animal[];  // 기존 단순 배열은 제거(또는 필요하다면 유지)
  animalsInfiniteData: InfiniteData<AnimalsResponse> | null;

  // setAnimals: (animals: Animal[]) => void; // 기존 setter 제거
  setAnimalsInfiniteData: (data: InfiniteData<AnimalsResponse> | null) => void;
}

export const useAnimalStore = create(
  persist<AnimalStore>(
    (set) => ({
      animalsInfiniteData: null,

      setAnimalsInfiniteData: (data) => set({ animalsInfiniteData: data }),
    }),
    {
      name: "animal-storage",
    }
  )
);

//
