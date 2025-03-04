//현재는 persistQuery로 인해서 안쓰게 됐지만 일단 남겨둡니다..
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InfiniteData } from "@tanstack/react-query";
import type { AnimalsResponse } from "../api/fetchAnimals";

interface AnimalStore {
  animalsInfiniteData: InfiniteData<AnimalsResponse> | null;

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
