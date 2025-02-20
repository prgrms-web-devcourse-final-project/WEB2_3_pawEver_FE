// import React from "react";
// import AnimalCard from "../../common/AnimalCard";

// export default function Community() {
//   //임시
//   const cards = new Array(12).fill(null);

//   return (
//     <section className="w-full my-8">
//       {/* 상단 바 */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mb-6">
//         {/* 왼쪽: 게시판 제목 */}
//         <h2 className="text-2xl font-bold">게시판</h2>

//         {/* 오른쪽: 검색창 + 글쓰기 버튼 */}
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           {/* 검색창 그룹 */}
//           <div className="flex flex-grow max-w-[400px]">
//             <input
//               type="text"
//               placeholder="검색어를 입력해주세요."
//               className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none"
//             />
//             <button className="bg-main text-white hover:bg-point border border-gray-300 border-l-0 px-4 py-2 rounded-r-md whitespace-nowrap">
//               검색
//             </button>
//           </div>
//           {/* 글쓰기 버튼 */}
//           <button className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap">
//             글쓰기
//           </button>
//         </div>
//       </div>

//       {/* 카드 리스트 */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full justify-items-center">
//         {cards.map((_, index) => (
//           <AnimalCard key={index} />
//         ))}
//       </div>
//     </section>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import AnimalCard from "../../common/AnimalCard";

export default function Community() {
  // 임시 데이터: 실제 프로젝트에서는 각 카드에 고유 id가 포함된 데이터를 사용
  const cards = new Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    // 기타 데이터
  }));

  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto">
        {/* 상단 바 */}
        <div className="px-2 flex items-center justify-between w-full mb-12 flex-nowrap">
          {/* <h2 className="text-2xl font-bold whitespace-nowrap flex-shrink-0">
            게시판
          </h2> */}

          {/* <div className="flex items-center gap-4 w-auto flex-shrink">
           
            <div className="flex w-[300px] md:w-[400px]">
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none"
              />
              <button className="bg-main text-white hover:bg-point border border-gray-300 border-l-0 px-4 py-2 rounded-r-md whitespace-nowrap">
                검색
              </button>
            </div>
           
            <button className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0">
              글쓰기
            </button>
          </div> */}

          <div className="flex items-center justify-between gap-4 w-full mb-6 flex-nowrap">
            {/* 왼쪽: 게시판 제목 */}
            <h2 className="text-2xl font-bold whitespace-nowrap flex-shrink-0">
              게시판
            </h2>
            {/* 오른쪽: 검색창 + 글쓰기 버튼 */}
            <div className="flex items-center gap-4 w-full md:w-auto flex-shrink max-[763px]:w-[350px] max-[763px]:flex-none">
              {/* 검색창 그룹 */}
              <div className="flex flex-grow max-w-[400px] min-w-0 max-[500px]:w-[300px] max-[500px]:flex-grow-0">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none min-w-0"
                />
                <button className="bg-main text-white hover:bg-point border border-gray-300 border-l-0 px-4 py-2 rounded-r-md whitespace-nowrap">
                  검색
                </button>
              </div>
              {/* 글쓰기 버튼 - 500px 이하에서는 숨김 */}
              <button className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap flex-shrink-0 max-[500px]:hidden">
                글쓰기
              </button>
            </div>
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className="grid gap-8 justify-items-center grid-cols-[repeat(auto-fit,minmax(256px,1fr))]">
          {cards.map((card) => (
            <Link key={card.id} to={`/community/${card.id}`}>
              <AnimalCard />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
