import { useMutation } from "@tanstack/react-query";
import authAxiosInstance from "../api/authAxiosInstance";
import { useAnimalLikeStore } from "../store/animalLikeStore";

export function useToggleLike() {
  return useMutation({
    // API만 호출
    mutationFn: async (animalId: number) => {
      await authAxiosInstance.post(`/api/animals/${animalId}/like-toggle`);
    },

    //낙관적 업데이트
    onMutate: (animalId: number) => {
      const { likedAnimals, likedAnimalDetails } =
        useAnimalLikeStore.getState();

      // 이전 상태 백업
      const backup = {
        likedAnimals: [...likedAnimals],
        likedAnimalDetails: [...likedAnimalDetails],
      };

      if (likedAnimals.includes(animalId)) {
        // 좋아요 취소
        useAnimalLikeStore.setState({
          likedAnimals: likedAnimals.filter((id) => id !== animalId),
          likedAnimalDetails: likedAnimalDetails.filter(
            (item) => item.id !== animalId
          ),
        });
      } else {
        // 좋아요 추가 (상세정보가 없다면 fetch, 또는 그냥 likedAnimals만 +1)
        useAnimalLikeStore.setState({
          likedAnimals: [...likedAnimals, animalId],
        });
      }

      return backup;
    },

    //API 실패 시 롤백
    onError: (_error, animalId, context) => {
      if (context) {
        useAnimalLikeStore.setState({
          likedAnimals: context.likedAnimals,
          likedAnimalDetails: context.likedAnimalDetails,
        });
      }
    },

    // 성공 후 서버 최신 목록 재조회.. 다른방법없나?
    onSuccess: () => {
      // 필요 시 주석 해제
      // useAnimalLikeStore.getState().fetchLikedAnimals();
    },
  });
}
