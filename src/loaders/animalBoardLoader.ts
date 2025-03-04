// import { queryClient } from "../queryClient";
// import fetchAnimals from "../api/fetchAnimals";
// import type { AnimalsResponse } from "../api/fetchAnimals";

// export async function animalBoardLoader() {
//   const pageNo = 1;
//   const numOfRows = 20; // 초기 로딩 시 필요한 데이터 수

//   // fetchQuery에 옵션 객체를 전달하는 방식으로 변경
//   const data: AnimalsResponse = await queryClient.fetchQuery({
//     queryKey: ["animalsList", pageNo, numOfRows],
//     queryFn: () => fetchAnimals({ pageNo, numOfRows }),
//   });
//   return data;
// }

//

// import { queryClient } from "../queryClient";
// import fetchAnimals from "../api/fetchAnimals";

// // 타입 정의 (선택 사항: 반환 타입 명시)
// export type AnimalBoardLoaderData = {
//   pageNo: number;
//   numOfRows: number;
// };

// export function animalBoardLoader(): AnimalBoardLoaderData {
//   const pageNo = 1;
//   const numOfRows = 20;

//   // 라우팅 단계에서 API 호출을 미리 시작 (기다리지 않음)
//   queryClient.prefetchQuery({
//     queryKey: ["animalsList", pageNo, numOfRows],
//     queryFn: () => fetchAnimals({ pageNo, numOfRows }),
//   });

//   // 즉시 반환해서 UI 렌더링으로 넘어감
//   return { pageNo, numOfRows };
// }

//애매하지만 타입에러없이 잘 되었음.

// animalBoardLoader.ts, CSR 방식

// import { queryClient } from "../queryClient";
// import fetchAnimals, { AnimalsResponse } from "../api/fetchAnimals";

// export type AnimalBoardLoaderData = {
//   pageNo: number;
//   numOfRows: number;
// };

// export function animalBoardLoader(): AnimalBoardLoaderData {
//   const pageNo = 1;
//   const numOfRows = 20;

//   // useFetchAnimals와 동일한 로직을 사용하여 prefetchInfiniteQuery 구현
//   queryClient.prefetchInfiniteQuery({
//     queryKey: ["animalsList", numOfRows],
//     queryFn: async ({ pageParam }) => {
//       try {
//         return await fetchAnimals({
//           pageNo: pageParam as number,
//           numOfRows: numOfRows,
//         });
//       } catch (error) {
//         // 요청 취소는 에러로 처리하지 않음
//         if (
//           error instanceof Error &&
//           error.message === "요청이 취소되었습니다."
//         ) {
//           return {
//             response: { body: { items: { item: [] } } },
//           } as AnimalsResponse;
//         }
//         throw error;
//       }
//     },
//     initialPageParam: pageNo,
//     getNextPageParam: (lastPage: AnimalsResponse, pages: AnimalsResponse[]) => {
//       const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
//       const loadedItems = pages.length * numOfRows;
//       return loadedItems < totalCount ? pages.length + 1 : undefined;
//     },
//   });

//   return {
//     pageNo,
//     numOfRows,
//   };
// }

//수정된 버전테스트 SSR-like

// import { queryClient } from "../queryClient";
// import fetchAnimals, { AnimalsResponse } from "../api/fetchAnimals";

// export type AnimalBoardLoaderData = {
//   pageNo: number;
//   numOfRows: number;
//   initialAnimals: AnimalsResponse;
// };

// // Data Router용 loader: 첫 페이지 데이터를 실제로 await하여 반환
// export async function animalBoardLoader(): Promise<AnimalBoardLoaderData> {
//   const pageNo = 1;
//   const numOfRows = 20;

//   const firstPageData = await fetchAnimals({ pageNo, numOfRows });

//   return {
//     pageNo,
//     numOfRows,
//     initialAnimals: firstPageData,
//   };
// }

// fetchInfiniteQuery 사용

import { queryClient } from "../queryClient";
import fetchAnimals, { AnimalsResponse } from "../api/fetchAnimals";
import type { InfiniteData } from "@tanstack/react-query";

export type AnimalBoardLoaderData = {
  pageNo: number;
  numOfRows: number;
  initialInfiniteData: InfiniteData<AnimalsResponse>;
};

export async function animalBoardLoader(): Promise<AnimalBoardLoaderData> {
  const pageNo = 1;
  const numOfRows = 20;

  const initialInfiniteData = await queryClient.fetchInfiniteQuery({
    queryKey: ["animalsList"],
    queryFn: async ({ pageParam = pageNo }) => {
      try {
        return await fetchAnimals({
          pageNo: pageParam,
          numOfRows,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "요청이 취소되었습니다."
        ) {
          return {
            response: { body: { items: { item: [] } } },
          } as AnimalsResponse;
        }
        throw error;
      }
    },
    initialPageParam: pageNo,
    getNextPageParam: (lastPage: AnimalsResponse, pages: AnimalsResponse[]) => {
      const totalCount = Number(lastPage.response?.body?.totalCount) || 0;
      const loadedItems = pages.length * numOfRows;
      return loadedItems < totalCount ? pages.length + 1 : undefined;
    },
  });

  return {
    pageNo,
    numOfRows,
    initialInfiniteData,
  };
}
