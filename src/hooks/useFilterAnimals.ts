import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import authAxiosInstance from "../api/authAxiosInstance";

interface Animal {
  id: number;
  providerShelterId: number;
  providerShelterName: string;
  imageUrl: string;
  name: string;
  neuteredStatus: string;
  characteristics: string[];
}

interface AnimalsResponse {
  isSuccess: boolean;
  status: string;
  code: string;
  data: {
    totalPages: number;
    content: Animal[];
  };
}

export interface FilterParams {
  species?: string;
  cityName?: string;
  districtName?: string;
  shelterId?: number | string;
  sex?: string;
  age?: string;
  q?: string;
  size?: number;
}

type AnimalQueryKey = ["filterAnimals", FilterParams];

/**
 * 서버 사이드 필터 + 무한스크롤용 커스텀 훅
 * - 필터 상태(filters)가 바뀌면 queryKey 변동, 첫 페이지부터 재조회
 * - IntersectionObserver 등을 통해 fetchNextPage() 호출,  페이지 추가 로드
 */
export default function useFilterAnimals(filters: FilterParams) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
    AnimalsResponse,
    Error,
    InfiniteData<AnimalsResponse>,
    AnimalQueryKey,
    number
  >({
    queryKey: ["filterAnimals", filters],
    queryFn: async ({ pageParam = 0, queryKey }) => {
      // queryKey = ["filterAnimals", filters]
      const [_key, filtersFromKey] = queryKey;

      // API에 실제로 전달할 파라미터 구성
      const params: Record<string, string | number | undefined> = {
        page: pageParam,
        size: filtersFromKey.size || 30, // 기본값 30
      };

      // 유효한 값만 파라미터에 추가
      if (filtersFromKey.species) params.species = filtersFromKey.species;
      if (filtersFromKey.cityName) params.cityName = filtersFromKey.cityName;
      if (filtersFromKey.districtName)
        params.districtName = filtersFromKey.districtName;
      if (filtersFromKey.shelterId) params.shelterId = filtersFromKey.shelterId;
      if (filtersFromKey.sex) params.sex = filtersFromKey.sex;
      if (filtersFromKey.age) params.age = filtersFromKey.age;
      if (filtersFromKey.q) params.q = filtersFromKey.q;

      // authAxiosInstance를 통한 GET 요청
      const response = await authAxiosInstance.get<AnimalsResponse>(
        "/api/animals/search",
        {
          params,
        }
      );

      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const { totalPages } = lastPage.data;
      const nextPage = allPages.length;
      // nextPage < totalPages 이면 다음 페이지 존재
      return nextPage < totalPages ? nextPage : undefined;
    },
    // 성능 최적화를 위한 추가 옵션
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  });

  // 모든 페이지의 content들을 합침
  const allAnimals = data?.pages.flatMap((page) => page.data.content) ?? [];

  return {
    allAnimals,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
