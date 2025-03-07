import axios from "axios";

interface AnimalsTopLevel {
  isSuccess: boolean;
  status: string;
  code: string;
  data: {
    totalPages: number;
    content: Animal[];
  };
}

export interface Animal {
  id: number;
  providerShelterId: number;
  providerShelterName: string;
  imageUrl: string;
  name: string;
  neuteredStatus: string;
  characteristics: string[];
}

export interface SavedAnimalsResponse {
  totalPages: number;
  animals: Animal[];
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface GetSavedAnimalsParams {
  page?: number;
  species?: string;
  cityName?: string;
  districtName?: string;
}

export async function getSavedAnimals(
  params: GetSavedAnimalsParams = {}
): Promise<SavedAnimalsResponse> {
  const { page = 0, species, cityName, districtName } = params;

  try {
    const response = await axios.get<AnimalsTopLevel>(
      `${baseURL}/api/animals`,
      {
        params: { page, species, cityName, districtName },
        withCredentials: true,
        timeout: 5000,
      }
    );
    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(`API error: ${result.status}`);
    }
    return {
      totalPages: result.data.totalPages,
      animals: result.data.content,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("getSavedAnimals - API 호출 에러:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
}
