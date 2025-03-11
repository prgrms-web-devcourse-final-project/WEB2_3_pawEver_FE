import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPostsStore } from "../../../store/userPostsStore";
import useritem_img from "../../../assets/images/useritem_img.svg";

export default function UserPost() {
  const navigate = useNavigate();
  const { posts, isLoading, error, fetchUserPosts } = useUserPostsStore();

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (isLoading) {
    return <div className="py-4 text-center">게시물을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  // 확인: posts가 배열인지 검사
  const postsArray = Array.isArray(posts) ? posts : [];

  if (postsArray.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        작성한 게시물이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {postsArray.map((post) => (
        <button
          key={post.id}
          className="flex w-full max-w-[873px] h-[180px] text-start"
          onClick={() => navigate(`/Community/${post.id}`)}
        >
          <img
            src={useritem_img}
            alt="사이드 이미지"
            className="ml-4 w-10 h-full"
          />
          <div className="ml-4 mt-5">
            <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
              {post.title}
            </div>
            <div className="mt-2 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
              {/* HTML 태그 제거하여 순수 텍스트만 표시 */}
              <p className="mb-6 md:mb-4 w-[300px] md:w-[400px] line-clamp-2">
                {post.content ? post.content.replace(/<[^>]*>/g, "") : ""}
              </p>
              <p>
                작성일{" "}
                {new Date(post.createdAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\. /g, ".")
                  .replace(/\.$/, "")}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
