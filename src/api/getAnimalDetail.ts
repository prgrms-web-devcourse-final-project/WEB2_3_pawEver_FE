import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export interface AnimalDetailData {
  id: number;
  imageUrl: string;
  name: string;
  neuteredStatus: string;
  weight: string;
  color: string;
  characteristics: string;
  shelterName: string;
  shelterPhoneNumber: string;
  shelterRoadAddress: string;
  latitude: number;
  longitude: number;
}

export interface AnimalDetailResponse {
  isSuccess: boolean;
  status: string;
  code: string;
  data: AnimalDetailData;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default async function getAnimalDetail(
  animalId: number,
  signal?: AbortSignal
): Promise<AnimalDetailResponse> {
  // Zustand에서 액세스 토큰 가져오기
  const token = useAuthStore.getState().userInfo?.accessToken;

  try {
    const requestUrl = `${baseURL}/api/animals/${animalId}`;
    console.log("요청 URL:", requestUrl);

    const config: AxiosRequestConfig = {
      method: "GET",
      url: requestUrl,
      withCredentials: true,
      timeout: 5000,
      signal,
      headers: {},
    };

    // 토큰이 있으면 Authorization 헤더를 세팅, 아마 이게 대부분 필요할거에요
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }

    const response = await axios.request<AnimalDetailResponse>(config);
    console.log("응답 데이터:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("동물 상세 데이터 fetching 중 오류:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        console.warn("인증 실패 - 쿠키/토큰이 만료되었거나 유효하지 않습니다.");
      }
    }
    throw error;
  }
}
