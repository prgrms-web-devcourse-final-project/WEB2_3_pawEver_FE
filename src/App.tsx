import { useState, useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import LoadingSpinner from "./common/LoadingSpinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 fresh
      cacheTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    } as any,
  },
});

// localStorage 기반 Persister 생성
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export default function App() {
  const {
    isLoggedIn,
    userInfo,
    refreshUserTokens,
    handleOAuthCallback,
    loadUserProfileFromDB,
  } = useAuthStore();

  const [isRestored, setIsRestored] = useState(false);
  const [didInitAuth, setDidInitAuth] = useState(false);
  const [didLoadProfile, setDidLoadProfile] = useState(false);

  useEffect(() => {
    if (didInitAuth) return;
    setDidInitAuth(true);
    const doInitialAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (code || error) {
          await handleOAuthCallback();
        } else {
          if (isLoggedIn && !userInfo?.accessToken) {
            const success = await refreshUserTokens();
            if (success) {
              console.log("[App] 초기화 시 토큰 재발급 성공");
            } else {
              console.warn("[App] 초기화 시 토큰 재발급 실패");
            }
          }
        }
      } catch (err) {
        console.error("[App] 초기 인증 처리 중 오류:", err);
      }
    };
    doInitialAuth();
  }, [
    didInitAuth,
    isLoggedIn,
    userInfo?.accessToken,
    handleOAuthCallback,
    refreshUserTokens,
  ]);
  useEffect(() => {
    if (!didInitAuth) return; // 초기 인증 절차가 끝나야 프로필 로드
    if (!isLoggedIn || !userInfo?.accessToken) {
      // 로그인 풀렸거나 토큰이 없으면 프로필 못 불러옴
      setDidLoadProfile(false);
      return;
    }
    if (didLoadProfile) return; // 이미 프로필 불러왔으면 스킵

    setDidLoadProfile(true); // 이제부터는 프로필 1회 로드로 간주
    (async () => {
      try {
        console.log("[App] 최신 사용자 프로필 로드 시도...");
        await loadUserProfileFromDB();
        console.log("[App] 사용자 프로필 로드 완료");
      } catch (err) {
        console.error("[App] 프로필 정보 로드 오류:", err);
      }
    })();
  }, [
    didInitAuth,
    isLoggedIn,
    userInfo?.accessToken,
    didLoadProfile,
    loadUserProfileFromDB,
  ]);

  return (
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24,
        }}
        onSuccess={() => setIsRestored(true)}
      >
        {!isRestored ? (
          <div className="max-w-[1200px] mx-auto p-4">
            <LoadingSpinner />
          </div>
        ) : (
          <Router />
        )}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </BrowserRouter>
  );
}
