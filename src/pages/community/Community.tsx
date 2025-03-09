import { Link } from "react-router-dom";
import CommunityCard from "./components/CommunityCard";
import { axiosInstance } from "../../api/axios";
import { useEffect, useState } from "react";
import { PostType } from "../../types/Post";

export default function Community() {
  const [posts, setPosts] = useState<PostType[] | null>(null);

  const fetchCommunity = async () => {
    try {
      const { data } = await axiosInstance.get("/api/community/posts");
      console.log(data.data);

      setPosts(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, []);

  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto ">
        {/* 상단: 제목, 검색, 글쓰기 버튼 */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12">
          <h2 className="text-2xl font-bold whitespace-nowrap mb-4 sm:mb-0 flex-shrink-0">
            게시판
          </h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-grow min-w-0 sm:max-w-[320px]">
              <input
                type="text"
                placeholder="검색어를 입력해주세요."
                className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none min-w-0"
              />
              <button className="bg-main text-white hover:bg-point border border-gray-300 border-l-0 px-4 py-2 rounded-r-md whitespace-nowrap">
                검색
              </button>
            </div>
            <Link
              to="/EditCommunity"
              className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap hidden sm:block"
            >
              글쓰기
            </Link>
          </div>
        </header>
        <div className="flex justify-end mb-6 sm:hidden">
          <Link
            to="/EditCommunity"
            className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap"
          >
            글쓰기
          </Link>
        </div>
        <div className="grid gap-4 justify-items-start grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8">
          {posts?.map((post) => (
            <CommunityCard key={post.id} {...post} />
          ))}
        </div>
        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>
    </section>
  );
}
