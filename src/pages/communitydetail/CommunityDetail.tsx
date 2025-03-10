import { useState, useEffect } from "react";
import more from "../../assets/icons/more.svg";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../types/Post";
import getRelativeTime from "../../utils/getRelativeTime";
import { deletePost, getPost } from "../../api/fetchPost";
import DeleteModal from "./components/DeleteModal";
import CommentSection from "./components/CommentSection";
import { Viewer } from "@toast-ui/react-editor";
import Button from "../../common/ButtonComponent";
import { useAuthStore } from "../../store/authStore";

export default function CommunityDetail() {
  // "2025년 3월 5일"
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [post, setPost] = useState<PostType | null>(null);
  const [contentWithImages, setContentWithImages] = useState<string>("");
  // more
  const [showEditDelete, setShowEditDelete] = useState<boolean>(false);
  // 글 삭제 모달
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const toggleEditDelete = () => {
    setShowEditDelete((prev) => !prev);
  };

  const replacePlaceholdersWithUrls = (
    content: string,
    uploadedUrls: string[]
  ) => {
    return content.replace(/{{images(\d+)}}/g, (_, index) => {
      return `${uploadedUrls[parseInt(index, 10)]}`;
    });
  };

  const { id: postId } = useParams();

  const getPostData = async (postId: string) => {
    try {
      const data = await getPost(postId);

      console.log(data);
      setPost(data);

      const { content, images } = data;
      const updatedContent = replacePlaceholdersWithUrls(content, images);
      setContentWithImages(updatedContent);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!postId) return;
    getPostData(postId);
  }, [postId]);

  const { userInfo } = useAuthStore();
  console.log(userInfo?.id);
  const isAuthor = userInfo?.id === String(post?.userUuid);
  const navigate = useNavigate();

  // 글 수정
  const editPost = () => {
    if (!postId) return;
    navigate(`/EditCommunity/${postId}`);
  };
  // 글 삭제
  const confirmDelete = async () => {
    if (!postId) return;

    try {
      await deletePost(postId);
      navigate("/community");
    } catch (err) {
      console.log("게시글 삭제 실패", err);
    }
  };
  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  if (!post) {
    return (
      <div className="p-6">
        <p>Loading...</p>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </div>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="max-w-[640px] mx-auto px-4">
        {/* 동물 카드 (임시 이미지) */}
        {post.thumbnailImage && (
          <img
            src={post.thumbnailImage}
            alt="thumbnail"
            className="object-cover w-full"
          />
        )}
        {/* 게시물 제목, 작성자, 시간 */}
        <div className="relative flex mt-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {isAuthor && (
            <button
              className="absolute right-0 top-1"
              onClick={toggleEditDelete}
            >
              <img src={more} alt="more" className="w-5 h-5" />
            </button>
          )}
          {showEditDelete && (
            <div className="absolute right-0 top-5 mt-2 flex flex-col bg-white shadow-md rounded">
              <button
                className="px-4 py-1 hover:bg-gray-100"
                onClick={editPost}
              >
                수정
              </button>
              <button
                className="px-4 py-1 hover:bg-gray-100"
                onClick={() => setDeleteModalOpen(true)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-2 flex gap-2">
          <span>{post.author}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>{getRelativeTime(new Date(post.createdAt).getTime())}</span>
        </div>
        {/* 게시물 본문 내용 */}
        <div className="my-8 text-base leading-relaxed">
          <Viewer initialValue={contentWithImages} />
        </div>
        {/* 댓글 섹션 */}
        <CommentSection post_Id={post.id} />
      </div>

      {/* 삭제확인 모달*/}
      {deleteModalOpen && (
        <DeleteModal onCancel={cancelDelete} onConfirm={confirmDelete} />
      )}
    </section>
  );
}
