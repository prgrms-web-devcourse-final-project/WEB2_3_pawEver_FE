import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

/**
 * 사용자 프로필을 수정하는 함수
 * PATCH 요청을 통해 /api/users/profiles 엔드포인트에 multipart/form-data 형식으로 요청
 * 모든 필드를 포함하되 변경되지 않은 필드는 null로 전송
 *
 * @param params - 업데이트할 프로필 데이터 ({ name?, introduction?, profileImage? })
 * @return {Promise<any>} 서버 응답 데이터를 반환합니다.
 */
export async function updateUserProfile(params: {
  name?: string;
  introduction?: string;
  profileImage?: File | null;
}): Promise<any> {
  // Zustand에서 액세스 토큰 가져오기
  const token = useAuthStore.getState().userInfo?.accessToken;
  console.log("토큰 확인:", token);

  if (!token) {
    console.error("인증 토큰이 존재하지 않습니다. 로그인이 필요합니다.");
    throw new Error("인증 토큰이 존재하지 않습니다. 로그인이 필요합니다.");
  }

  // FormData 생성
  const formData = new FormData();

  // 텍스트 데이터를 JSON 형태로 Blob 생성하여 'data' 키에 추가
  const jsonData: Record<string, string | null> = {
    // 필드가 정의되었다면 해당 값을 사용하고, 정의되지 않았다면 null 사용
    name: params.name !== undefined ? params.name : null,
    introduction:
      params.introduction !== undefined ? params.introduction : null,
  };

  // JSON Blob 생성 및 추가
  const jsonBlob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // profileImage 처리
  // params에 있다면 파일 추가, 없다면 null 표시를 위한 빈 Blob 추가
  if (params.profileImage !== undefined && params.profileImage !== null) {
    // 이미지 유효성 검사
    if (!params.profileImage.type.startsWith("image/")) {
      console.error("업로드 파일은 이미지 파일이어야 합니다.");
      throw new Error("업로드 파일은 이미지 파일이어야 합니다.");
    }
    formData.append("profileImage", params.profileImage);
  } else {
    // profileImage가 undefined나 null인 경우, 서버가 이를 감지할 수 있도록 처리
    //빈 Blob을 추가하거나
    const emptyBlob = new Blob([], { type: "application/octet-stream" });
    formData.append("profileImage", emptyBlob);

    //추가 플래그 필드를 사용
    formData.append("profileImageNull", "true");
  }

  console.log("FormData 구성 완료:", formData);

  // Axios 요청 설정
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseURL}/api/users/profiles`;
  console.log("요청 URL:", url);

  try {
    console.log("PATCH 요청 시작...");
    const response = await axios.patch(url, formData, config);
    console.log("서버 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    throw error;
  }
}
