//useAnimals로 래핑했습니다.
import axios from "axios";

export interface Animal {
  id: number;
  providerShelterId: number;
  providerShelterName: string;
  imageUrl: string;
  name: string;
  neuteredStatus: string;
  characteristics: string[];
}

export interface AnimalSearchResponse {
  animals: Animal[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

export async function getAnimals(
  page: number = 0,
  token?: string
): Promise<AnimalSearchResponse> {
  try {
    console.log("요청 URL:", `${baseURL}/api/animals/search?page=${page}`);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await axios.get<AnimalSearchResponse>(
      `${baseURL}/api/animals/search?page=${page}`,
      {
        headers,
        withCredentials: true,
        timeout: 5000,
      }
    );
    console.log("응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("동물 데이터 fetching 중 오류:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        console.warn("인증 실패 - 토큰을 확인하세요");
      }
    }
    throw error;
  }
}
