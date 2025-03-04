// import React, { useState } from "react";
// import KakaoMap from "../../components/KakaoMap";
// import exampleAnimal from "../../assets/images/exampleAnimal.png";
// import mapMarker from "../../assets/icons/mapMarker.svg";
// import ButtonComponent from "../../common/ButtonComponent";
// import LikeIcon from "../../assets/icons/like.svg?react";

// const AnimalDetail: React.FC = () => {
//   const [isLiked, setIsLiked] = useState(false);

//   return (
//     <div className="max-w-4xl mx-auto p-6 ">
//       <div className="flex pb-4">
//         <div className="w-1/2 pr-4 relative">
//           <img
//             src={exampleAnimal}
//             className="rounded-lg w-full h-auto border border-gray-300"
//             alt="Pet"
//           />
//         </div>
//         <div className="w-1/2 pl-4">
//           <div className="flex items-center justify-between border-b border-gray-300 pb-2">
//             <h2 className="text-2xl font-semibold">아바시니안 1개월 (남아)</h2>
//             <button
//               onClick={() => setIsLiked(!isLiked)}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <LikeIcon
//                 className="w-6 h-6"
//                 fill={isLiked ? "#FF0000" : "none"}
//                 stroke={isLiked ? "#EF4444" : "currentColor"}
//               />
//             </button>
//           </div>
//           <p className="text-gray-600 text-sm mt-1">
//             유기번호: <span className="font-medium">5461151351</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             중성화 여부: <span className="font-medium">중성화 완료</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             몸무게: <span className="font-medium">5kg</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             털색: <span className="font-medium">흰색/갈색</span>
//           </p>
//           <p className="text-gray-600 text-sm border-b border-gray-300 pb-2">
//             특징: <span className="font-medium">겁이 많음</span>
//           </p>

//           {/* Shelter Info Now Placed Directly Below Features */}
//           <div className="mt-4">
//             <h3 className="text-lg font-medium flex items-center">
//               📞 보호소 정보
//             </h3>
//             <p className="text-gray-600 text-sm">제주 동물보호센터</p>
//             <p className="text-gray-600 text-sm">
//               전화번호: <span className="font-medium">064-710-4065</span>
//             </p>
//             <p className="text-gray-600 text-sm">
//               담당자 전화번호: <span className="font-medium">064-710-4065</span>
//             </p>
//             <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
//           </div>
//         </div>
//       </div>

//       {/* Shelter Address Below Image */}
//       <div className="mt-6 border-t border-gray-300 pt-4">
//         <h3 className="text-lg font-medium flex items-center">
//           <img src={mapMarker} className="mr-1" /> 보호소 주소
//         </h3>
//         <div className="w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-300">
//           <KakaoMap
//             centerLat={33.4996}
//             centerLng={126.5312}
//             width="100%"
//             height="100%"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnimalDetail;

//Zustand 전용

// import { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// // (useQuery는 사용 안 하면 지워도 됩니다)
// // import { useQuery } from "@tanstack/react-query";

// import KakaoMap from "../../components/KakaoMap";
// import ButtonComponent from "../../common/ButtonComponent";
// import LikeIcon from "../../assets/icons/like.svg?react";
// import mapMarker from "../../assets/icons/mapMarker.svg";
// import exampleAnimal from "../../assets/images/exampleAnimal.png";
// import { useAnimalStore } from "../../store/animalStore";

// export default function AnimalDetail() {
//   // URL 파라미터 "id" (동물의 desertionNo)
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // 변경된 Zustand에서 InfiniteData<AnimalsResponse> 꺼내기
//   const animalsInfiniteData = useAnimalStore(
//     (state) => state.animalsInfiniteData
//   );

//   // 여러 페이지를 전부 flatMap해서 하나의 Animal 배열로 만들기
//   const allAnimals = useMemo(() => {
//     if (!animalsInfiniteData) return [];
//     return animalsInfiniteData.pages.flatMap(
//       (page) => page.response?.body?.items?.item ?? []
//     );
//   }, [animalsInfiniteData]);

//   // 현재 페이지에서 파라미터로 받은 desertionNo와 일치하는 객체 찾기
//   const animal = allAnimals.find((item) => item.desertionNo === id);

//   // 페이지 이동 시 스크롤을 최상단으로 이동
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   if (!animal) {
//     return (
//       <div>
//         <p>Animal not found.</p>
//         <ButtonComponent onClick={() => navigate(-1)}>뒤로가기</ButtonComponent>
//       </div>
//     );
//   }

//   // 좋아요 상태 관리
//   const [isLiked, setIsLiked] = useState(false);

//   const sexText =
//     animal.sexCd === "M" ? "남아" : animal.sexCd === "F" ? "여아" : "미상";

//   const neuterText =
//     animal.neuterYn === "Y"
//       ? "중성화 완료"
//       : animal.neuterYn === "N"
//       ? "중성화 안됨"
//       : "정보 없음";

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex pb-4">
//         <div className="w-1/2 pr-4 relative">
//           <img
//             src={animal.popfile || exampleAnimal}
//             alt="Pet"
//             className="rounded-lg w-full h-auto border border-gray-300"
//           />
//         </div>
//         <div className="w-1/2 pl-4">
//           <div className="flex items-center justify-between border-b border-gray-300 pb-2">
//             <h2 className="text-2xl font-semibold">
//               {animal.kindCd} {animal.age} ({sexText})
//             </h2>
//             <button
//               onClick={() => setIsLiked(!isLiked)}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <LikeIcon
//                 className="w-6 h-6"
//                 fill={isLiked ? "#FF0000" : "none"}
//                 stroke={isLiked ? "#EF4444" : "currentColor"}
//               />
//             </button>
//           </div>
//           <p className="text-gray-600 text-sm mt-1">
//             유기번호: <span className="font-medium">{animal.desertionNo}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             중성화 여부: <span className="font-medium">{neuterText}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             몸무게:{" "}
//             <span className="font-medium">{animal.weight || "정보 없음"}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             털색:{" "}
//             <span className="font-medium">{animal.colorCd || "정보 없음"}</span>
//           </p>
//           <p className="text-gray-600 text-sm border-b border-gray-300 pb-2">
//             특징:{" "}
//             <span className="font-medium">{animal.specialMark || "없음"}</span>
//           </p>

//           <div className="mt-4">
//             <h3 className="text-lg font-medium flex items-center">
//               📞 보호소 정보
//             </h3>
//             <p className="text-gray-600 text-sm">
//               {animal.careNm || "정보 없음"}
//             </p>
//             <p className="text-gray-600 text-sm">
//               전화번호:{" "}
//               <span className="font-medium">
//                 {animal.careTel || "정보 없음"}
//               </span>
//             </p>
//             <p className="text-gray-600 text-sm">
//               담당자 전화번호:{" "}
//               <span className="font-medium">
//                 {animal.officetel || "정보 없음"}
//               </span>
//             </p>
//             <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 border-t border-gray-300 pt-4">
//         <h3 className="text-lg font-medium flex items-center">
//           <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
//         </h3>
//         <div className="w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-300">
//           <KakaoMap
//             centerLat={33.4996}
//             centerLng={126.5312}
//             width="100%"
//             height="100%"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

//테스트

// import { useMemo, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQueryClient, InfiniteData } from "@tanstack/react-query";
// import KakaoMap from "../../components/KakaoMap";
// import ButtonComponent from "../../common/ButtonComponent";
// import LikeIcon from "../../assets/icons/like.svg?react";
// import mapMarker from "../../assets/icons/mapMarker.svg";
// import exampleAnimal from "../../assets/images/exampleAnimal.png";
// import type { AnimalsResponse } from "../../api/fetchAnimals";

// export default function AnimalDetail() {
//   // URL 파라미터 :id (동물의 desertionNo)
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // AnimalBoard에서 사용한 쿼리 키와 동일하게 ["animalsList"]를 사용
//   const queryClient = useQueryClient();
//   const animalsInfiniteData = queryClient.getQueryData<
//     InfiniteData<AnimalsResponse>
//   >(["animalsList"]);

//   // 여러 페이지의 데이터를 하나의 배열로 합칩니다.
//   const allAnimals = useMemo(() => {
//     if (!animalsInfiniteData) return [];
//     return animalsInfiniteData.pages.flatMap(
//       (page) => page.response?.body?.items?.item ?? []
//     );
//   }, [animalsInfiniteData]);

//   // URL의 id와 일치하는 동물 데이터를 찾습니다.
//   const animal = allAnimals.find((item: any) => item.desertionNo === id);

//   // 모든 렌더에서 항상 호출하도록 훅을 상단에 배치합니다.
//   const [isLiked, setIsLiked] = useState(false);

//   // 페이지 이동 시 최상단으로 스크롤
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // 캐시 데이터가 없거나 일치하는 동물이 없는 경우 fallback UI를 표시합니다.
//   if (!animal) {
//     return (
//       <div className="p-6">
//         <p>Animal not found.</p>
//         <ButtonComponent onClick={() => navigate(-1)}>뒤로가기</ButtonComponent>
//       </div>
//     );
//   }

//   const sexText =
//     animal.sexCd === "M" ? "남아" : animal.sexCd === "F" ? "여아" : "미상";
//   const neuterText =
//     animal.neuterYn === "Y"
//       ? "중성화 완료"
//       : animal.neuterYn === "N"
//       ? "중성화 안됨"
//       : "정보 없음";

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex pb-4">
//         <div className="w-1/2 pr-4 relative">
//           <img
//             src={animal.popfile || exampleAnimal}
//             alt="Pet"
//             className="rounded-lg w-full h-auto border border-gray-300"
//           />
//         </div>
//         <div className="w-1/2 pl-4">
//           <div className="flex items-center justify-between border-b border-gray-300 pb-2">
//             <h2 className="text-2xl font-semibold">
//               {animal.kindCd} {animal.age} ({sexText})
//             </h2>
//             <button
//               onClick={() => setIsLiked(!isLiked)}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <LikeIcon
//                 className="w-6 h-6"
//                 fill={isLiked ? "#FF0000" : "none"}
//                 stroke={isLiked ? "#EF4444" : "currentColor"}
//               />
//             </button>
//           </div>
//           <p className="text-gray-600 text-sm mt-1">
//             유기번호: <span className="font-medium">{animal.desertionNo}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             중성화 여부: <span className="font-medium">{neuterText}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             몸무게:{" "}
//             <span className="font-medium">{animal.weight || "정보 없음"}</span>
//           </p>
//           <p className="text-gray-600 text-sm">
//             털색:{" "}
//             <span className="font-medium">{animal.colorCd || "정보 없음"}</span>
//           </p>
//           <p className="text-gray-600 text-sm border-b border-gray-300 pb-2">
//             특징:{" "}
//             <span className="font-medium">{animal.specialMark || "없음"}</span>
//           </p>
//           <div className="mt-4">
//             <h3 className="text-lg font-medium flex items-center">
//               📞 보호소 정보
//             </h3>
//             <p className="text-gray-600 text-sm">
//               {animal.careNm || "정보 없음"}
//             </p>
//             <p className="text-gray-600 text-sm">
//               전화번호:{" "}
//               <span className="font-medium">
//                 {animal.careTel || "정보 없음"}
//               </span>
//             </p>
//             <p className="text-gray-600 text-sm">
//               담당자 전화번호:{" "}
//               <span className="font-medium">
//                 {animal.officetel || "정보 없음"}
//               </span>
//             </p>
//             <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 border-t border-gray-300 pt-4">
//         <h3 className="text-lg font-medium flex items-center">
//           <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
//         </h3>
//         <div className="w-full h-40 mt-2 rounded-lg overflow-hidden border border-gray-300">
//           <KakaoMap
//             centerLat={33.4996}
//             centerLng={126.5312}
//             width="100%"
//             height="100%"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

//반응형 적용 1

// import { useMemo, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQueryClient, InfiniteData } from "@tanstack/react-query";
// import KakaoMap from "../../components/KakaoMap";
// import ButtonComponent from "../../common/ButtonComponent";
// import LikeIcon from "../../assets/icons/like.svg?react";
// import mapMarker from "../../assets/icons/mapMarker.svg";
// import exampleAnimal from "../../assets/images/exampleAnimal.png";
// import type { AnimalsResponse } from "../../api/fetchAnimals";

// export default function AnimalDetail() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const queryClient = useQueryClient();
//   const animalsInfiniteData = queryClient.getQueryData<
//     InfiniteData<AnimalsResponse>
//   >(["animalsList"]);

//   const allAnimals = useMemo(() => {
//     if (!animalsInfiniteData) return [];
//     return animalsInfiniteData.pages.flatMap(
//       (page) => page.response?.body?.items?.item ?? []
//     );
//   }, [animalsInfiniteData]);

//   const animal = allAnimals.find((item: any) => item.desertionNo === id);

//   const [isLiked, setIsLiked] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   if (!animal) {
//     return (
//       <div className="p-6">
//         <p>Animal not found.</p>
//         <ButtonComponent onClick={() => navigate(-1)}>뒤로가기</ButtonComponent>
//       </div>
//     );
//   }

//   const sexText =
//     animal.sexCd === "M" ? "남아" : animal.sexCd === "F" ? "여아" : "미상";
//   const neuterText =
//     animal.neuterYn === "Y"
//       ? "중성화 완료"
//       : animal.neuterYn === "N"
//       ? "중성화 안됨"
//       : "정보 없음";

//   const detailRows = [
//     { label: "유기번호", value: animal.desertionNo, extra: "mt-1" },
//     { label: "중성화 여부", value: neuterText },
//     { label: "몸무게", value: animal.weight || "정보 없음" },
//     { label: "털색", value: animal.colorCd || "정보 없음" },
//     {
//       label: "특징",
//       value: animal.specialMark || "없음",
//       extra: "border-b border-gray-300 pb-2",
//     },
//   ];

//   // return (
//   //   <div className="max-w-4xl mx-auto p-6">
//   //     {/* 반응형: 모바일은 세로 배치, md 이상에서는 가로 배치 */}
//   //     <div className="flex flex-col md:flex-row pb-4">
//   //       <div className="w-full md:w-1/2 pr-0 md:pr-4 relative mb-4 md:mb-0">
//   //         {/* <img
//   //           src={animal.popfile || exampleAnimal}
//   //           alt="Pet"
//   //           className="w-full rounded-lg h-auto border border-gray-300"
//   //         /> */}
//   //         <img
//   //           src={animal.popfile || exampleAnimal}
//   //           alt="Pet"
//   //           className="w-full h-60 object-cover rounded-lg border border-gray-300"
//   //         />
//   //       </div>
//   //       <div className="w-full md:w-1/2 pl-0 md:pl-4">
//   //         <div className="flex items-center justify-between border-b border-gray-300 pb-2">
//   //           <h2 className="text-2xl md:text-3xl font-semibold">
//   //             {animal.kindCd} {animal.age} ({sexText})
//   //           </h2>
//   //           <button
//   //             onClick={() => setIsLiked(!isLiked)}
//   //             className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//   //           >
//   //             <LikeIcon
//   //               className="w-6 h-6"
//   //               fill={isLiked ? "#FF0000" : "none"}
//   //               stroke={isLiked ? "#EF4444" : "currentColor"}
//   //             />
//   //           </button>
//   //         </div>
//   //         <div className="mt-2">
//   //           {detailRows.map(({ label, value, extra }, index) => (
//   //             <p
//   //               key={index}
//   //               className={`text-gray-600 text-sm ${
//   //                 extra ? extra : index === 0 ? "mt-1" : ""
//   //               }`}
//   //             >
//   //               {label}: <span className="font-medium">{value}</span>
//   //             </p>
//   //           ))}
//   //         </div>
//   //         <div className="mt-4">
//   //           <h3 className="text-lg font-medium flex items-center">
//   //             📞 보호소 정보
//   //           </h3>
//   //           <p className="text-gray-600 text-sm">
//   //             {animal.careNm || "정보 없음"}
//   //           </p>
//   //           <p className="text-gray-600 text-sm">
//   //             전화번호:{" "}
//   //             <span className="font-medium">
//   //               {animal.careTel || "정보 없음"}
//   //             </span>
//   //           </p>
//   //           <p className="text-gray-600 text-sm">
//   //             담당자 전화번호:{" "}
//   //             <span className="font-medium">
//   //               {animal.officetel || "정보 없음"}
//   //             </span>
//   //           </p>
//   //           <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
//   //         </div>
//   //       </div>
//   //     </div>
//   //     <div className="mt-6 border-t border-gray-300 pt-4">
//   //       <h3 className="text-lg font-medium flex items-center">
//   //         <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
//   //       </h3>
//   //       <div className="w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden border border-gray-300">
//   //         <KakaoMap
//   //           centerLat={33.4996}
//   //           centerLng={126.5312}
//   //           width="100%"
//   //           height="100%"
//   //         />
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* 반응형: 모바일은 세로 배치, md 이상에서는 가로 배치, items-stretch로 높이 맞춤 */}
//       <div className="flex flex-col md:flex-row items-stretch pb-4">
//         <div className="w-full md:w-1/2 pr-0 md:pr-4 relative mb-4 md:mb-0 flex">
//           <img
//             src={animal.popfile || exampleAnimal}
//             alt="Pet"
//             className="w-full md:h-full object-cover rounded-lg border border-gray-300"
//           />
//         </div>
//         <div className="w-full md:w-1/2 pl-0 md:pl-4">
//           <div className="flex items-center justify-between border-b border-gray-300 pb-2">
//             <h2 className="text-2xl md:text-3xl font-semibold">
//               {animal.kindCd} {animal.age} ({sexText})
//             </h2>
//             <button
//               onClick={() => setIsLiked(!isLiked)}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <LikeIcon
//                 className="w-6 h-6"
//                 fill={isLiked ? "#FF0000" : "none"}
//                 stroke={isLiked ? "#EF4444" : "currentColor"}
//               />
//             </button>
//           </div>
//           <div className="mt-2">
//             {detailRows.map(({ label, value, extra }, index) => (
//               <p
//                 key={index}
//                 className={`text-gray-600 text-sm ${
//                   extra ? extra : index === 0 ? "mt-1" : ""
//                 }`}
//               >
//                 {label}: <span className="font-medium">{value}</span>
//               </p>
//             ))}
//           </div>
//           <div className="mt-4">
//             <h3 className="text-lg font-medium flex items-center">
//               📞 보호소 정보
//             </h3>
//             <p className="text-gray-600 text-sm">
//               {animal.careNm || "정보 없음"}
//             </p>
//             <p className="text-gray-600 text-sm">
//               전화번호:{" "}
//               <span className="font-medium">
//                 {animal.careTel || "정보 없음"}
//               </span>
//             </p>
//             <p className="text-gray-600 text-sm">
//               담당자 전화번호:{" "}
//               <span className="font-medium">
//                 {animal.officetel || "정보 없음"}
//               </span>
//             </p>
//             <ButtonComponent className="w-40 mt-2">상담하기</ButtonComponent>
//           </div>
//         </div>
//       </div>
//       <div className="mt-6 border-t border-gray-300 pt-4">
//         <h3 className="text-lg font-medium flex items-center">
//           <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
//         </h3>
//         <div className="w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden border border-gray-300">
//           <KakaoMap
//             centerLat={33.4996}
//             centerLng={126.5312}
//             width="100%"
//             height="100%"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import KakaoMap from "../../components/KakaoMap";
import ButtonComponent from "../../common/ButtonComponent";
import LikeIcon from "../../assets/icons/like.svg?react";
import mapMarker from "../../assets/icons/mapMarker.svg";
import exampleAnimal from "../../assets/images/exampleAnimal.png";
import type { AnimalsResponse } from "../../api/fetchAnimals";

export default function AnimalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const animalsInfiniteData = queryClient.getQueryData<
    InfiniteData<AnimalsResponse>
  >(["animalsList"]);

  const allAnimals = useMemo(() => {
    if (!animalsInfiniteData) return [];
    return animalsInfiniteData.pages.flatMap(
      (page) => page.response?.body?.items?.item ?? []
    );
  }, [animalsInfiniteData]);

  const animal = allAnimals.find((item: any) => item.desertionNo === id);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!animal) {
    return (
      <div className="p-6">
        <p>Animal not found.</p>
        <ButtonComponent onClick={() => navigate(-1)}>뒤로가기</ButtonComponent>
      </div>
    );
  }

  const sexText =
    animal.sexCd === "M" ? "남아" : animal.sexCd === "F" ? "여아" : "미상";
  const neuterText =
    animal.neuterYn === "Y"
      ? "중성화 완료"
      : animal.neuterYn === "N"
      ? "중성화 안됨"
      : "정보 없음";

  const detailRows = [
    { label: "유기번호", value: animal.desertionNo, extra: "mt-1" },
    { label: "중성화 여부", value: neuterText },
    { label: "몸무게", value: animal.weight || "정보 없음" },
    { label: "털색", value: animal.colorCd || "정보 없음" },
    {
      label: "특징",
      value: animal.specialMark || "없음",
      extra: "border-b border-gray-300 pb-2",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 반응형: 모바일은 세로 배치, md 이상에서는 가로 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {/* 이미지 컨테이너 */}
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg border border-gray-300">
          <img
            src={animal.popfile || exampleAnimal}
            alt="Pet"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 오른쪽 설명 박스 */}
        <div className="w-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {animal.kindCd} {animal.age} ({sexText})
              </h2>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <LikeIcon
                  className="w-6 h-6"
                  fill={isLiked ? "#FF0000" : "none"}
                  stroke={isLiked ? "#EF4444" : "currentColor"}
                />
              </button>
            </div>
            <div className="mt-2">
              {detailRows.map(({ label, value, extra }, index) => (
                <p
                  key={index}
                  className={`text-gray-600 text-sm ${
                    extra ? extra : index === 0 ? "mt-1" : ""
                  }`}
                >
                  {label}: <span className="font-medium">{value}</span>
                </p>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium flex items-center">
                📞 보호소 정보
              </h3>
              <p className="text-gray-600 text-sm">
                {animal.careNm || "정보 없음"}
              </p>
              <p className="text-gray-600 text-sm">
                전화번호:{" "}
                <span className="font-medium">
                  {animal.careTel || "정보 없음"}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                담당자 전화번호:{" "}
                <span className="font-medium">
                  {animal.officetel || "정보 없음"}
                </span>
              </p>
            </div>
          </div>
          {/* 상담하기 버튼을 하단에 고정 */}
          <div className="mt-4">
            <ButtonComponent className="w-40 bg-main text-white hover:bg-point">
              상담하기
            </ButtonComponent>
          </div>
        </div>
      </div>

      {/* 보호소 지도 */}
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium flex items-center">
          <img src={mapMarker} className="mr-1" alt="map marker" /> 보호소 주소
        </h3>
        <div className="w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden border border-gray-300">
          <KakaoMap
            centerLat={33.4996}
            centerLng={126.5312}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
