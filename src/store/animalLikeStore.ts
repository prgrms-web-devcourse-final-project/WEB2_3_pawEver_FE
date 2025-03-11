import { create } from "zustand";
import { persist } from "zustand/middleware";
import authAxiosInstance from "../api/authAxiosInstance";

// 응답 구조에 맞춘 상세 정보 인터페이스
export interface LikedAnimalDetail {
  id: number;
  name: string;
  age: string;
  sex: string;
  imageUrl?: string;
  shelterName?: string;
  distanceToShelter?: number;
  // 필요하면 더 많은 필드 가능
}

interface AnimalLikeStore {
  // 좋아요된 동물 ID 목록 (간단 체크용)
  likedAnimals: number[];

  // 좋아요된 동물 상세 정보
  likedAnimalDetails: LikedAnimalDetail[];

  toggleAnimalLike: (animalId: number) => Promise<void>;
  fetchLikedAnimals: () => Promise<void>;
}

export const useAnimalLikeStore = create<AnimalLikeStore>()(
  persist(
    (set, get) => ({
      likedAnimals: [],
      likedAnimalDetails: [],

      // 좋아요 토글
      toggleAnimalLike: async (animalId: number) => {
        try {
          // POST /api/animals/{animalId}/like-toggle
          await authAxiosInstance.post(`/api/animals/${animalId}/like-toggle`);
          set((state) => {
            if (state.likedAnimals.includes(animalId)) {
              // 이미 좋아요된 상태 → 취소
              return {
                likedAnimals: state.likedAnimals.filter(
                  (id) => id !== animalId
                ),
                likedAnimalDetails: state.likedAnimalDetails.filter(
                  (animal) => animal.id !== animalId
                ),
              };
            } else {
              // 좋아요 추가
              return {
                likedAnimals: [...state.likedAnimals, animalId],
                // likedAnimalDetails는 fetchLikedAnimals() 후에 최신화해도 됩니다.
              };
            }
          });
        } catch (error) {
          console.error("[toggleAnimalLike] 실패:", error);
        }
      },

      // 유저가 좋아요한 동물 목록 전체 가져오기
      fetchLikedAnimals: async () => {
        try {
          // GET /api/users/liked-animals
          const response = await authAxiosInstance.get(
            "/api/users/liked-animals"
          );
          // 응답 구조: { code: "SUCCESS_0", data: [...] }
          const data = response.data.data; // LikedAnimalDetail[]

          set({
            likedAnimalDetails: data,
            likedAnimals: data.map((animal: LikedAnimalDetail) => animal.id),
          });
        } catch (err) {
          console.error("[fetchLikedAnimals] 실패:", err);
        }
      },
    }),
    {
      name: "likedAnimals-storage",
    }
  )
);
