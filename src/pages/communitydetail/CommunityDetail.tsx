import { useState, useEffect, useRef } from "react";
import more from "../../assets/icons/more.svg";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../types/Post";
import { deletePost, getPost } from "../../api/fetchPost";
import DeleteModal from "./components/DeleteModal";
import CommentSection from "./components/CommentSection";
import { Viewer } from "@toast-ui/react-editor";
import Button from "../../common/ButtonComponent";
import { useAuthStore } from "../../store/authStore";
import formatDate from "../../utils/formatDate";
import toast from "react-hot-toast";
import LoadingSpinner from "../../common/LoadingSpinner";

export default function CommunityDetail() {
  const [post, setPost] = useState<PostType | null>(null);
  const [contentWithImages, setContentWithImages] = useState<string>("");
  const [showEditDelete, setShowEditDelete] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const editRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (editRef.current && !editRef.current.contains(event.target as Node))
      setShowEditDelete(false);
  };

  useEffect(() => {
    if (showEditDelete) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditDelete]);

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
  const isAuthor = userInfo?.id === String(post?.userUuid);
  const navigate = useNavigate();

  const editPost = () => {
    if (!postId) return;
    navigate(`/EditCommunity/${postId}`);
  };

  const confirmDelete = async () => {
    if (!postId) return;

    try {
      await deletePost(postId);
      navigate("/community");
      toast.success("게시글이 삭제되었습니다.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#09ACFB",
          color: "#FFFFFF",
          border: "1px solid #0187EE",
        },

        iconTheme: {
          primary: "#FFFFFF",
          secondary: "#09ACFB",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  if (!post) {
    return (
      <div className="p-6">
        <LoadingSpinner />
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
      </div>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="max-w-[640px] mx-auto px-4">
        {post.thumbnailImage && (
          <img
            src={post.thumbnailImage}
            alt="thumbnail"
            className="object-cover w-full"
          />
        )}
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
            <div
              ref={editRef}
              className="absolute right-0 top-5 mt-2 flex flex-col bg-white shadow-md rounded"
            >
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
        <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 pb-3 border-b">
          <img
            src={post.profileImage}
            alt="작성자 프로필"
            className="w-6 h-6 rounded-full"
          />
          <span>{post.author}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="my-8 text-base leading-relaxed">
          <Viewer initialValue={contentWithImages} />
        </div>
        <CommentSection post_Id={post.id} />
      </div>

      {deleteModalOpen && (
        <DeleteModal onCancel={cancelDelete} onConfirm={confirmDelete} />
      )}
    </section>
  );
}
