import authAxiosInstance from "./authAxiosInstance";
import { useAuthStore } from "../store/authStore";
import { UserInfo } from "../store/authStore";

/**
 * 백엔드 응답 타입 정의
 */
interface UpdateProfileResponse {
  isSuccess: boolean;
  message?: string;
  updatedProfile?: {
    name?: string;
    email?: string;
    profileImageUrl?: string;
    introduction?: string;
  };
}

/**
 * 사용자 프로필을 수정하는 함수
 * PATCH 요청을 통해 /api/users/profiles 엔드포인트에 multipart/form-data 형식으로 요청
 * 변경된 필드만 전송하여 최적화
 *
 * @param params - 업데이트할 프로필 데이터 ({ name?, introduction?, profileImage? })
 * @return {Promise<UpdateProfileResponse>} 서버 응답 데이터를 반환합니다.
 */
export async function updateUserProfile(params: {
  name?: string;
  introduction?: string;
  profileImage?: File | null;
}): Promise<UpdateProfileResponse> {
  console.log("[updateUserProfile] 프로필 업데이트 요청:", params);

  // 토큰 확인 및 갱신
  let token = useAuthStore.getState().userInfo?.accessToken;
  if (!token) {
    console.warn(
      "[updateUserProfile] 토큰이 존재하지 않습니다. 토큰 갱신 시도..."
    );

    token = useAuthStore.getState().userInfo?.accessToken;
    if (!token) {
      console.error(
        "[updateUserProfile] 인증 토큰이 존재하지 않습니다. 로그인이 필요합니다."
      );
      throw new Error("인증 토큰이 존재하지 않습니다. 로그인이 필요합니다.");
    }
  }

  // FormData 생성
  const formData = new FormData();

  // 텍스트 데이터를 JSON 형태의 Blob으로 만들어 'data' 필드에 추가
  // 변경된 필드만 전송하기 위해 undefined 값은 제외
  const jsonData: Record<string, string | null> = {};

  if (params.name !== undefined) {
    jsonData.name = params.name;
  }

  if (params.introduction !== undefined) {
    jsonData.introduction = params.introduction;
  }

  const jsonBlob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // profileImage 처리: 파일이 있으면 추가, 없으면 빈 Blob 및 플래그 필드 전달
  if (params.profileImage !== undefined) {
    if (params.profileImage !== null) {
      if (!params.profileImage.type.startsWith("image/")) {
        console.error(
          "[updateUserProfile] 업로드 파일은 이미지 파일이어야 합니다."
        );
        throw new Error("업로드 파일은 이미지 파일이어야 합니다.");
      }
      formData.append("profileImage", params.profileImage);
    } else {
      // null인 경우 프로필 이미지 삭제 요청
      const emptyBlob = new Blob([], { type: "application/octet-stream" });
      formData.append("profileImage", emptyBlob);
      formData.append("profileImageNull", "true");
    }
  }

  console.log("[updateUserProfile] FormData 구성 완료");

  try {
    console.log("[updateUserProfile] PATCH 요청 시작...");

    // Authorization 헤더 확인
    if (!authAxiosInstance.defaults.headers.common["Authorization"]) {
      authAxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    const response = await authAxiosInstance.patch<UpdateProfileResponse>(
      "/api/users/profiles",
      formData
    );

    console.log("[updateUserProfile] 서버 응답:", response.data);

    // 응답이 성공적이면, Zustand 상태 업데이트
    if (response.data.isSuccess && response.data.updatedProfile) {
      const updatedProfile = response.data.updatedProfile;

      // 백엔드 응답 데이터를 UserInfo 타입에 맞게 변환
      const userInfoUpdate: Partial<UserInfo> = {};

      if (updatedProfile.name !== undefined) {
        userInfoUpdate.name = updatedProfile.name;
      }

      if (updatedProfile.email !== undefined) {
        userInfoUpdate.email = updatedProfile.email;
      }

      if (updatedProfile.profileImageUrl !== undefined) {
        // 백엔드의 profileImageUrl을 프론트엔드의 picture 필드에 매핑
        userInfoUpdate.picture = updatedProfile.profileImageUrl;
      }

      if (updatedProfile.introduction !== undefined) {
        userInfoUpdate.introduction = updatedProfile.introduction;
      }

      // Zustand 상태 업데이트
      console.log("[updateUserProfile] 사용자 정보 업데이트:", userInfoUpdate);
      useAuthStore.getState().updateUserInfo(userInfoUpdate);

      // 토큰 갱신이 필요한 경우 (선택적)
      try {
        const refreshed = await useAuthStore.getState().refreshUserTokens();
        if (refreshed) {
          console.log("[updateUserProfile] 엑세스토큰이 성공적으로 갱신됨");
        }
      } catch (tokenError) {
        console.error("[updateUserProfile] 토큰 갱신 중 오류 발생", tokenError);
        // 토큰 갱신 실패는 프로필 업데이트 성공에 영향 없음
      }
    } else if (!response.data.isSuccess) {
      console.error(
        "[updateUserProfile] 프로필 업데이트 실패:",
        response.data.message
      );
      throw new Error(
        response.data.message || "프로필 업데이트에 실패했습니다."
      );
    }

    return response.data;
  } catch (error) {
    console.error("[updateUserProfile] 프로필 업데이트 요청 오류:", error);
    throw error;
  }
}

/**
 * 현재 로그인한 사용자의 최신 프로필 정보를 가져오는 함수
 * 이 함수는 로그인 후 또는 앱 초기화 시 최신 데이터를 로드하는데 사용
 *
 * @returns {Promise<UserInfo | null>} 최신 사용자 정보 또는 null
 */
export async function fetchCurrentUserProfile(): Promise<UserInfo | null> {
  const { userInfo, updateUserInfo } = useAuthStore.getState();

  // 로그인 상태가 아니면 null 반환
  if (!userInfo?.accessToken) {
    console.warn(
      "[fetchCurrentUserProfile] 토큰이 없어 프로필을 가져올 수 없습니다."
    );
    return null;
  }

  try {
    console.log("[fetchCurrentUserProfile] 최신 프로필 정보 요청 중...");

    // Authorization 헤더 확인 및 설정
    if (!authAxiosInstance.defaults.headers.common["Authorization"]) {
      authAxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userInfo.accessToken}`;
    }

    const response = await authAxiosInstance.get("/api/users/profiles");

    if (response.data && response.status === 200) {
      console.log(
        "[fetchCurrentUserProfile] 프로필 정보 가져오기 성공:",
        response.data
      );

      // 서버 응답 데이터를 UserInfo 형식에 맞게 변환
      const profileData = response.data;
      const updatedUserInfo: Partial<UserInfo> = {
        name: profileData.name || userInfo.name,
        email: profileData.email || userInfo.email,
        picture: profileData.profileImageUrl || userInfo.picture,
        introduction: profileData.introduction || userInfo.introduction,
      };

      // Zustand 상태 업데이트
      updateUserInfo(updatedUserInfo);

      // 업데이트된 전체 사용자 정보 반환
      return { ...userInfo, ...updatedUserInfo };
    }

    return userInfo;
  } catch (error) {
    console.error(
      "[fetchCurrentUserProfile] 프로필 정보 가져오기 실패:",
      error
    );
    return userInfo; // 에러 발생 시 현재 상태 유지
  }
}
