import axios from "axios";
import authAxiosInstance from "../api/authAxiosInstance";
import type { SocialLoginPayload } from "../store/authStore";

// CodeVerifier 생성
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
    .substring(0, 128);
}

// Code Challenge 생성
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // 문자열을 UTF-8 인코딩된 바이트 배열로 변환
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // SHA-256 해싱
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);

  // 해시 결과를 Base64URL로 인코딩
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = String.fromCharCode(...hashArray);
  return btoa(hashString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function requestPreLogin(codeChallenge: string): Promise<string> {
  try {
    const response = await authAxiosInstance.get("/api/auth/tokens/attempts", {
      params: {
        codeChallenge,
        codeChallengeMethod: "S256",
      },
    });

    const jwt = response.data?.data;

    if (!jwt || typeof jwt !== "string") {
      throw new Error("유효한 JWT가 응답에 없습니다");
    }

    return jwt;
  } catch (error) {
    console.error("프리로그인 요청 실패:", error);
    throw error;
  }
}

async function requestFinalLogin(
  socialPayload: SocialLoginPayload,
  codeVerifier: string,
  preLoginJwt: string
): Promise<string> {
  try {
    const response = await authAxiosInstance.post("/api/auth/tokens", {
      ...socialPayload,
      codeVerifier,
      preLoginJwt,
    });

    const headerToken = response.headers?.authorization?.replace("Bearer ", "");

    return headerToken;
  } catch (error: unknown) {
    // Error 타입으로 안전하게 타입 체크
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
    }

    if (axios.isAxiosError(error) && error.response) {
      console.error("에러 응답 데이터:", error.response.data);
    }
    throw error;
  }
}

const pkceUtils = {
  generateCodeVerifier,
  generateCodeChallenge,
  requestPreLogin,
  requestFinalLogin,
};

export default pkceUtils;
