import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { getAnimals, Animal } from "../api/getAnimals";

// 실제 응답 구조에 맞춘 타입 정의
interface AnimalSearchResponseAPI {
  isSuccess: boolean;
  status: string;
  code: string;
  data: {
    totalPages: number;
    content: Animal[];
  };
}

interface UseTempAnimalsResult {
  allAnimals: Animal[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function useAnimals(token?: string): UseTempAnimalsResult {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    AnimalSearchResponseAPI,
    Error,
    InfiniteData<AnimalSearchResponseAPI>,
    [string, string | undefined]
  >({
    queryKey: ["tempAnimals", token],
    queryFn: async ({
      pageParam = 0,
    }: QueryFunctionContext<[string, string | undefined]>) => {
      console.log("[useTempAnimals] queryFn called for pageParam:", pageParam);
      const response = await getAnimals(pageParam as number, token);

      return response as unknown as AnimalSearchResponseAPI;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length - 1;
      const totalPages = lastPage.data.totalPages;
      console.log(
        "[useTempAnimals] getNextPageParam - currentPage:",
        currentPage,
        "totalPages:",
        totalPages
      );
      if (currentPage < totalPages - 1) {
        const nextPage = currentPage + 1;
        console.log("[useTempAnimals] Next page exists. nextPage:", nextPage);
        return nextPage;
      }
      console.log("[useTempAnimals] No next page.");
      return undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    console.log("[useTempAnimals] Data updated:", data);
  }, [data]);

  // 각 페이지의 동물 데이터는 page.data.content 에 있어용
  const allAnimals: Animal[] =
    data?.pages.flatMap((page) => {
      console.log("[useTempAnimals] Processing page data:", page);
      return page.data.content ?? [];
    }) ?? [];

  useEffect(() => {
    console.log("[useTempAnimals] Combined allAnimals:", allAnimals);
  }, [allAnimals]);

  if (isError) {
    console.error("[useTempAnimals] Error fetching data:", error);
  }

  return {
    allAnimals,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
}
