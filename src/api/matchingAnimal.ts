import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Zustand store import

// 추천 개(Dog) 응답 타입 정의
type RecommendResponse = {
  data: any;
  responses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
};

const getUserToken = (): string | null => {
  const userInfo = useAuthStore.getState().userInfo;
  return userInfo?.accessToken ?? null;
};

// 추천 개api
export async function recommendDog(
  API_BASE_URL: string,
  answersHistory: { questionId: number; optionId: number }[]
): Promise<RecommendResponse | { error: string; details: any }> {
  try {
    const token: string | null = getUserToken();
    const endpoint = `${API_BASE_URL}/api/recommend-animals/dog`;

    // responses 객체를 answersHistory 배열을 기반으로 동적으로 생성
    const responses: Record<number, number> = {};
    answersHistory.forEach((answer) => {
      responses[answer.questionId] = answer.optionId;
    });

    // 보내는 데이터 형식
    const requestData = {
      responses,
    };

    console.log("Request Data for Dog API:", requestData);

    const response = await axios.post<RecommendResponse>(
      endpoint,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "API Request Failed:",
      error.response?.status,
      error.response?.data
    );
    return {
      error: `Request failed with status code ${error.response?.status}`,
      details: error.response?.data,
    };
  }
}

// 추천 고양이api
export async function recommendCat(
  API_BASE_URL: string,
  answersHistory: { questionId: number; optionId: number }[]
): Promise<RecommendResponse | { error: string; details: any }> {
  try {
    const token: string | null = getUserToken();
    const endpoint = `${API_BASE_URL}/api/recommend-animals/cat`;

    // responses 객체를 answersHistory 배열을 기반으로 동적으로 생성
    const responses: Record<number, number> = {};
    answersHistory.forEach((answer) => {
      responses[answer.questionId] = answer.optionId;
    });

    // 보내는 데이터 형식
    const requestData = {
      responses,
    };

    console.log("Request Data for Cat API:", requestData);

    const response = await axios.post<RecommendResponse>(
      endpoint,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "API Request Failed:",
      error.response?.status,
      error.response?.data
    );
    return {
      error: `Request failed with status code ${error.response?.status}`,
      details: error.response?.data,
    };
  }
}

type QuestionsResponse = {
  questions: {
    id: string;
    question: string;
    options: string[];
  }[];
};

// 추천 개 질문 API
export async function getDogQuestions(
  API_BASE_URL: string
): Promise<QuestionsResponse | { error: string; details: any }> {
  try {
    const token: string | null = getUserToken();
    const endpoint = `${API_BASE_URL}/api/recommend-animals/dogs/questions`;

    const response = await axios.get<QuestionsResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("모든 강아지 질문 API 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "API 요청 실패:",
      error.response?.status,
      error.response?.data
    );
    return {
      error: `상태 코드 ${error.response?.status}로 요청 실패`,
      details: error.response?.data,
    };
  }
}

// 추천 고양이 질문 API
export async function getCatQuestions(
  API_BASE_URL: string
): Promise<QuestionsResponse | { error: string; details: any }> {
  try {
    const token: string | null = getUserToken();
    const endpoint = `${API_BASE_URL}/api/recommend-animals/cats/questions`;

    const response = await axios.get<QuestionsResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("모든 고양이 질문 API 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "API 요청 실패:",
      error.response?.status,
      error.response?.data
    );
    return {
      error: `상태 코드 ${error.response?.status}로 요청 실패`,
      details: error.response?.data,
    };
  }
}

// 주변 추천 동물 응답 항목 타입 정의
type NearbyAnimalItem = {
  imageUrl: string;
  name: string;
  age: string;
  sex: string;
  shelterName: string;
  distanceKm: number;
};

// 주변 추천 동물 API 응답 타입 정의
type NearbyAnimalsResponse = {
  data: NearbyAnimalItem[];
};

// 주변 추천 동물 API
export async function getNearbyAnimals(
  API_BASE_URL: string
): Promise<NearbyAnimalsResponse | { error: string; details: any }> {
  try {
    const token: string | null = getUserToken();
    const endpoint = `${API_BASE_URL}/api/recommend-animals/nearby`;

    const response = await axios.get<NearbyAnimalsResponse>(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("주변 추천 동물 API 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "API 요청 실패:",
      error.response?.status,
      error.response?.data
    );
    return {
      error: `상태 코드 ${error.response?.status}로 요청 실패`,
      details: error.response?.data,
    };
  }
}
