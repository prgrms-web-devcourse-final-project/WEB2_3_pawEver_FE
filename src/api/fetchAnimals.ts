import createAxiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

/** 한 마리 동물 데이터 타입 */
export interface Animal {
  desertionNo: string;
  filename?: string;
  happenDt?: string;
  happenPlace?: string;
  kindCd: string;
  colorCd?: string;
  age: string;
  weight?: string;
  noticeNo?: string;
  noticeSdt?: string;
  noticeEdt: string;
  popfile?: string;
  processState?: string;
  sexCd: "M" | "F" | "Q";
  neuterYn?: string;
  specialMark?: string;
  careNm?: string;
  careTel?: string;
  careAddr?: string;
  orgNm?: string;
  chargeNm?: string;
  officetel?: string;
}

/** API가 반환하는 응답 구조 */
export interface AnimalsResponse {
  response?: {
    header?: {
      reqNo?: number;
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      totalCount?: string; // 전체 데이터 수
      items?: {
        item?: Animal[];
      };
    };
  };
}

/** API 호출 파라미터 */
export interface FetchAnimalsParams {
  pageNo: number;
  numOfRows: number;
  signal?: AbortSignal;
}

// 타임아웃 설정 (10초)
const TIMEOUT_MS = 10000;

export default async function fetchAnimals({
  pageNo,
  numOfRows,
  signal,
}: FetchAnimalsParams): Promise<AnimalsResponse> {
  const axiosInstance = createAxiosInstance();

  // 타임아웃 설정
  axiosInstance.defaults.timeout = TIMEOUT_MS;

  // 디버깅용 로그 최소화
  if (process.env.NODE_ENV !== "production") {
    console.log("fetchAnimals 요청 시작:", { pageNo, numOfRows });
  }

  try {
    const response = await axiosInstance.get("/abandonmentPublic", {
      params: {
        pageNo,
        numOfRows,
        _type: "json", // JSON 응답
      },
      signal,
    });

    // 결과 데이터만 간단하게
    if (process.env.NODE_ENV !== "production") {
      const itemCount = response.data?.response?.body?.items?.item?.length || 0;
      console.log(`fetchAnimals 응답 수신: ${itemCount}개 항목`);
    }

    return response.data as AnimalsResponse;
  } catch (error: any) {
    const axiosError = error as AxiosError;

    // 타임아웃 에러 특별 처리
    if (axiosError.code === "ECONNABORTED") {
      console.error("fetchAnimals 요청 타임아웃 발생");
      throw new Error(
        "API 요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요."
      );
    }

    // 취소된 요청은 에러로 간주하지 않음
    if (axiosError.code === "ERR_CANCELED") {
      console.log("fetchAnimals 요청이 취소되었습니다.");
      throw new Error("요청이 취소되었습니다.");
    }

    // 에러 로깅 최소화
    console.error("fetchAnimals API 오류:", axiosError.message);

    throw error;
  }
}
