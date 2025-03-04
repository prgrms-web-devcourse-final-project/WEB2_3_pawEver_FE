// import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import Router from "./Router";
// import { Toaster } from "react-hot-toast";

// const queryClient = new QueryClient();

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <Router />
//         <Toaster />
//       </BrowserRouter>
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

//

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import Router from "./Router";
// import { Toaster } from "react-hot-toast";

// const queryClient = new QueryClient();

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router />
//       <Toaster />
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// }

//

import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Router from "./Router";
import { Toaster } from "react-hot-toast";
import SkeletonCard from "./common/SkeletonCard";

// QueryClient 생성 (버전 5.66 기준)
// 기본 옵션에 staleTime, cacheTime, refetch 옵션들을 지정합니다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 fresh
      cacheTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    } as any, // 타입 오류 우회를 위한 캐스팅
  },
});

// localStorage 기반 Persister 생성
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export default function App() {
  const [isRestored, setIsRestored] = useState(false);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
      onSuccess={() => setIsRestored(true)}
    >
      {!isRestored ? (
        // fallback UI로 Skeleton 컴포넌트를 사용
        <div className="max-w-[1200px] mx-auto p-4">
          <SkeletonCard />
        </div>
      ) : (
        <Router />
      )}
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}

//
