import axios, { AxiosInstance } from "axios";

export default function createAxiosInstance(): AxiosInstance {
  // .env에 정의된 두 환경변수
  const baseURL: string =
    import.meta.env.VITE_ABANDONMENT_PUBLIC_SRVC_URL || "";
  const apiKey: string =
    import.meta.env.VITE_ABANDONMENT_PUBLIC_SRVC_API_KEY || "";

  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    // 모든 요청에 serviceKey 쿼리 파라미터 자동 포함
    params: {
      serviceKey: apiKey,
    },
  });

  return instance;
}
