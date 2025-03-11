import authAxiosInstance from "./authAxiosInstance";

// 유저가 좋아요한 동물 목록 가져오기
export async function getLikedAnimals() {
  // 실제 API 엔드포인트: GET /api/users/liked-animals
  const response = await authAxiosInstance.get("/api/users/liked-animals");
  const checkdata = response.data;
  console.log("동물좋아요", checkdata);
  return response.data;
}
