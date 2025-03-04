import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Router from "./Router";
import SkeletonCard from "./common/SkeletonCard";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 fresh
      cacheTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    } as any, // 타입 오류 우회ㅠㅠ
  },
});

// localStorage 기반 Persister 생성
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export default function App() {
  const [isRestored, setIsRestored] = useState(false);

  return (
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
        onSuccess={() => setIsRestored(true)}
      >
        {!isRestored ? (
          // fallback UI로 Skeleton 컴포넌트를 사용, 수정예정
          <div className="max-w-[1200px] mx-auto p-4">
            <SkeletonCard />
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

//
