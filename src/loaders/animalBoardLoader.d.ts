import { AnimalsResponse } from "../api/fetchAnimals";
import type { InfiniteData } from "@tanstack/react-query";
export type AnimalBoardLoaderData = {
    pageNo: number;
    numOfRows: number;
    initialInfiniteData: InfiniteData<AnimalsResponse>;
};
export declare function animalBoardLoader(): Promise<AnimalBoardLoaderData>;
