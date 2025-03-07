import axiosInstance from "./authAxiosInstance";

export interface JwtRequestPayload {
  socialLoginUuid: string;
  name: string;
  profileImageUrl: string;
  email: string;
  socialLoginProvider: string;
  latitude: string;
  longitude: string;
}

export interface JwtResponse {
  isSuccess: boolean;
  token?: string;
  userId?: string;
  name?: string;
  email?: string;
  picture?: string;
}

//  Access Token을 담을 수 있도록 타입 확장
// (기존 JwtResponse에 넣어도 되고, 별도 필드로 해도 됨)
export interface ExtendedJwtResponse extends JwtResponse {
  accessToken?: string; // Authorization 헤더에서 가져올 예정
}

export async function requestJwtFromBackend(
  payload: JwtRequestPayload
): Promise<ExtendedJwtResponse> {
  try {
    const response = await axiosInstance.post<JwtResponse>(
      "/api/auth/tokens",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 기존 body 데이터
    const data = response.data;

    const accessTokenHeader = response.headers["authorization"];

    let pureToken;
    if (accessTokenHeader && accessTokenHeader.startsWith("Bearer ")) {
      pureToken = accessTokenHeader.slice(7); // Bearer  이후만 추출
    }

    return {
      ...data,
      accessToken: pureToken,
    };
  } catch (error) {
    console.error("JWT 요청 에러:", error);
    return { isSuccess: false };
  }
}
