import type { InfiniteData } from "@tanstack/react-query";
import type { AnimalsResponse } from "../api/fetchAnimals";
interface AnimalStore {
    animalsInfiniteData: InfiniteData<AnimalsResponse> | null;
    setAnimalsInfiniteData: (data: InfiniteData<AnimalsResponse> | null) => void;
}
export declare const useAnimalStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AnimalStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AnimalStore, AnimalStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AnimalStore) => void) => () => void;
        onFinishHydration: (fn: (state: AnimalStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AnimalStore, AnimalStore>>;
    };
}>;
export {};
