/**
 * @module useFetchAnimals
 *
 * @param pageSize - 한 페이지당 불러올 동물 데이터 개수 (기본값: 20)
 *
 * @returns
 * - query: useInfiniteQuery가 반환하는 상태와 함수들 (예: data, isLoading, fetchNextPage 등)
 * - allAnimals: 한 페이지에서 불러온 동물 데이터를 하나의 배열로 반환한 값
 */

import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import fetchAnimals, { AnimalsResponse } from "../api/fetchAnimals";

export function useFetchAnimals(pageSize: number = 20) {
  const query = useInfiniteQuery<AnimalsResponse, Error>({
    queryKey: ["animalsUrgent", pageSize],
    initialPageParam: 1,

    // 쿼리 설정
    enabled: true,
    staleTime: 1000 * 60 * 15, // 15분 캐싱
    gcTime: 1000 * 60 * 30, // 30분 가비지 컬렉션 시간
    refetchOnWindowFocus: false,
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지

    // 재시도 설정
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    queryFn: async ({ pageParam, signal }: QueryFunctionContext) => {
      try {
        return await fetchAnimals({
          pageNo: pageParam as number,
          numOfRows: pageSize,
          signal,
        });
      } catch (error) {
        // 요청 취소는 에러로 처리하지 않음
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

    getNextPageParam: (lastPage, pages) => {
      const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
      const loadedItems = pages.length * pageSize;

      // 다음 페이지가 있는지 확인
      return loadedItems < totalCount ? pages.length + 1 : undefined;
    },
  });

  // 데이터 선별 및 가공을 위한 함수
  const getAllAnimals = () => {
    return (
      query.data?.pages.flatMap(
        (page) => page.response?.body?.items?.item ?? []
      ) ?? []
    );
  };

  return {
    ...query,
    getAllAnimals,
  };
}
