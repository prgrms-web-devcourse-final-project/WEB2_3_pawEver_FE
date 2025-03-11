import { Link } from "react-router-dom";
import CommunityCard from "./components/CommunityCard";
import { useEffect, useState } from "react";
import { PostType } from "../../types/Post";
import { getfilteredPosts, getPosts } from "../../api/fetchCommunity";
import noresult from "../../assets/icons/noSearchResult.svg";
import LoadingSpinner from "../../common/LoadingSpinner";
import { useAuthStore } from "../../store/authStore";

export default function Community() {
  const { isLoggedIn } = useAuthStore();
  const [status, setStatus] = useState<"initial" | "loading" | "searching">(
    "initial"
  );
  const [posts, setPosts] = useState<PostType[]>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredposts, setfilteredPosts] = useState<PostType[]>();

  const getPostsData = async () => {
    setStatus("loading");
    try {
      const data = await getPosts();

      setPosts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setStatus("initial");
    }
  };

  useEffect(() => {
    getPostsData();
  }, []);

  const getFilteredPostsData = async () => {
    if (!searchQuery.trim()) {
      setStatus("initial");
      setfilteredPosts(undefined);
      return;
    }

    setStatus("searching");

    try {
      setStatus("loading");
      const filteredData = await getfilteredPosts(searchQuery);

      setfilteredPosts(filteredData);
    } catch (err) {
      console.log(err);
    } finally {
      setStatus("searching");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    getFilteredPostsData();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <section className="w-full my-8">
      <div className="max-w-[1200px] mx-auto ">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12">
          <a
            href="/community"
            className="text-2xl font-bold whitespace-nowrap mb-4 sm:mb-0 flex-shrink-0"
          >
            게시판
          </a>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-grow min-w-0 sm:max-w-[320px]">
              <input
                type="text"
                value={searchQuery}
                onKeyDown={handleKeyDown}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력해주세요."
                className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none min-w-0"
              />
              <button
                onClick={handleSearch}
                className="bg-main text-white hover:bg-point border border-gray-300 border-l-0 px-4 py-2 rounded-r-md whitespace-nowrap"
              >
                검색
              </button>
            </div>
            <Link
              to="/EditCommunity"
              className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap hidden sm:block"
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  alert("로그인 후 사용해주세요!");
                }
              }}
            >
              글쓰기
            </Link>
          </div>
        </header>
        <div className="flex justify-end mb-6 sm:hidden">
          <Link
            to="/EditCommunity"
            className="bg-main hover:bg-point text-white px-4 py-2 rounded-md whitespace-nowrap"
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                alert("로그인 후 사용해주세요!");
              }
            }}
          >
            글쓰기
          </Link>
        </div>
        <div
          className={`grid gap-4 justify-items-start  ${
            (status === "searching" && !filteredposts?.length) ||
            (status === "initial" && !posts?.length)
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8"
          }`}
        >
          {status === "loading" && <LoadingSpinner />}

          {status === "searching" &&
            (filteredposts?.length ? (
              filteredposts.map((post) => (
                <CommunityCard key={post.id} {...post} />
              ))
            ) : (
              <div className="w-full flex flex-col  items-center justify-center text-gray-500 gap-2 ">
                <img src={noresult} alt="검색결과없음" className="w-24 h-24" />
                <p className="text-2xl font-semibold">검색 결과가 없습니다.</p>
                <p className="text-sm font-medium">
                  다른 키워드로 검색해보세요.
                </p>
                <a
                  href="/community"
                  className="px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center text-white bg-main hover:bg-point"
                >
                  전체 게시글 보기
                </a>
              </div>
            ))}

          {status === "initial" &&
            (posts?.length ? (
              posts.map((post) => <CommunityCard key={post.id} {...post} />)
            ) : (
              <LoadingSpinner />
            ))}
        </div>
        <div className="h-8" />
      </div>
    </section>
  );
}
