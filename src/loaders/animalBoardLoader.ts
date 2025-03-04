//loader 사용하게된다면.. 꼭 사용해볼 예정!
import { queryClient } from "../queryClient";
import fetchAnimals, { AnimalsResponse } from "../api/fetchAnimals";
import type { InfiniteData } from "@tanstack/react-query";

export type AnimalBoardLoaderData = {
  pageNo: number;
  numOfRows: number;
  initialInfiniteData: InfiniteData<AnimalsResponse>;
};

export async function animalBoardLoader(): Promise<AnimalBoardLoaderData> {
  const pageNo = 1;
  const numOfRows = 20;

  const initialInfiniteData = await queryClient.fetchInfiniteQuery({
    queryKey: ["animalsList"],
    queryFn: async ({ pageParam = pageNo }) => {
      try {
        return await fetchAnimals({
          pageNo: pageParam,
          numOfRows,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "요청이 취소되었습니다."
        ) {
          return {
            response: { body: { items: { item: [] } } },
          } as AnimalsResponse;
        }
        throw error;
      }
    },
    initialPageParam: pageNo,
    getNextPageParam: (lastPage: AnimalsResponse, pages: AnimalsResponse[]) => {
      const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
      const loadedItems = pages.length * numOfRows;
      return loadedItems < totalCount ? pages.length + 1 : undefined;
    },
  });

  return {
    pageNo,
    numOfRows,
    initialInfiniteData,
  };
}
