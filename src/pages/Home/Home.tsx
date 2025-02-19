import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">홈 페이지</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/AnimalBoard"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          입양 동물 전체보기
        </Link>
        <Link
          to="/AnimalDetail/1"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          입양 동물 상세보기
        </Link>
        <Link
          to="/EditReservation"
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          예약/상담 신청
        </Link>
        <Link
          to="/Matching"
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          맞춤 애완동물 찾기
        </Link>
        <Link
          to="/Community"
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          커뮤니티 게시판
        </Link>
        <Link
          to="/CommunityDetail/1"
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          커뮤니티 상세보기
        </Link>
        <Link
          to="/EditCommunity"
          className="px-4 py-2 bg-pink-500 text-white rounded"
        >
          커뮤니티 작성하기
        </Link>
        <Link
          to="/UserPage/123"
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          마이페이지
        </Link>
      </div>
    </div>
  );
}
