import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 응답 데이터 타입 정의
export interface Animal {
  id: number;
  providerShelterId: number;
  providerShelterName: string;
  imageUrl: string;
  name: string;
  neuteredStatus: string;
  characteristics: string[];
}

interface AnimalResponse {
  isSuccess: boolean;
  status: string;
  code: string;
  data: {
    totalPages: number;
    content: Animal[];
  };
}

interface FetchAnimalsParams {
  page?: number;
  size?: number;
  // 필요한 경우 추가 필터링 파라미터
}

interface ProtectedAnimalsResult {
  animals: Animal[];
  totalPages: number;
  isSuccess: boolean;
}

// 단일 페이지 보호중인 동물 데이터를 가져오는 함수
async function fetchProtectedAnimals(
  params: FetchAnimalsParams = {}
): Promise<AnimalResponse> {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "https://yellowdog.p-e.kr";

  // 기본 파라미터 설정
  const defaultParams = {
    page: 0, // 기본 페이지는 0부터 시작
    size: 5, // API가 페이지당 5개만 반환함
  };

  // 합쳐진 파라미터
  const queryParams = { ...defaultParams, ...params };

  try {
    const response = await axios.get(`${baseURL}/api/animals`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("보호 중인 동물 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

// 여러 페이지의 보호중인 동물 데이터를 가져오는 함수
async function fetchMultiPageProtectedAnimals(
  pageCount: number,
  params: Omit<FetchAnimalsParams, "page"> = {}
): Promise<ProtectedAnimalsResult> {
  // page 매개변수를 제외한 나머지 매개변수 설정
  const queryParams = { ...params, size: params.size || 5 };

  try {
    // 각 페이지에 대한 요청 배열 생성
    const requests = Array.from({ length: pageCount }, (_, index) =>
      fetchProtectedAnimals({ ...queryParams, page: index })
    );

    // 병렬로 모든 요청 실행
    const responses = await Promise.all(requests);

    // 응답 데이터 병합
    let allAnimals: Animal[] = [];
    let maxTotalPages = 0;
    let allSuccess = true;

    responses.forEach((response) => {
      if (response.isSuccess) {
        allAnimals = [...allAnimals, ...response.data.content];
        maxTotalPages = Math.max(maxTotalPages, response.data.totalPages);
      } else {
        allSuccess = false;
      }
    });

    return {
      animals: allAnimals,
      totalPages: maxTotalPages,
      isSuccess: allSuccess,
    };
  } catch (error) {
    console.error(
      "여러 페이지의 보호 중인 동물 데이터를 가져오는 중 오류 발생:",
      error
    );
    throw error;
  }
}

// 커스텀 훅
export default function useProtectedAnimals(
  params: FetchAnimalsParams = {},
  pageCount: number = 1
) {
  return useQuery({
    queryKey: ["protectedAnimals", params, pageCount],
    queryFn: () =>
      pageCount > 1
        ? fetchMultiPageProtectedAnimals(pageCount, params)
        : fetchProtectedAnimals(params).then((data) => ({
            animals: data.data.content,
            totalPages: data.data.totalPages,
            isSuccess: data.isSuccess,
          })),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 캐싱
    retry: 1, // 실패 시 1번 재시도
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
  });
}
