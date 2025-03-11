import { useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} from "../../../api/fetchComment";
import { useAuthStore } from "../../../store/authStore";
import Comment from "./Comment";
import { CommentType } from "../../../types/Comment";
import toast from "react-hot-toast";
import commenticon from "../../../assets/icons/comment.svg";

export default function CommentSection({
  post_Id,
}: {
  post_Id: number | undefined;
}) {
  const { userInfo } = useAuthStore();

  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [comment, setComment] = useState<string>("");
  const [showButtons, setShowButtons] = useState(false);

  const getCommentData = async () => {
    if (!post_Id) return;
    try {
      const data = await getComment(post_Id);
      setCommentList(data.replies);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!post_Id) return;
    getCommentData();
  }, [post_Id]);

  const handleSubmitComment = async () => {
    if (!post_Id || !comment.trim()) return;
    try {
      const response = await createComment(post_Id, comment);
      setComment("");
      setShowButtons(false);
      setCommentList((prev) => [...prev, response.data]);
      toast.success("댓글이 작성되었습니다.", {
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

  const confirmDelete = async (postId: number, replyId: number) => {
    if (!postId || !replyId) return;

    try {
      await deleteComment(postId, replyId);
      setCommentList((prev) =>
        prev.filter((comment) => comment.replyId !== replyId)
      );
      toast.success("댓글이 삭제되었습니다.", {
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

  const handleEditComment = async (
    postId: number,
    replyId: number,
    editcomment: string
  ) => {
    if (!postId || !replyId || !editcomment.trim()) return;
    try {
      await updateComment(postId, replyId, editcomment);
      setCommentList((prev) =>
        prev.map((comment) =>
          comment.replyId === replyId
            ? { ...comment, content: editcomment }
            : comment
        )
      );
      toast.success("댓글이 수정되었습니다.", {
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
  return (
    <div>
      <span className="text-lg font-semibold">댓글 {commentList.length}개</span>
      {userInfo && (
        <div className="mt-4">
          <div className="flex items-start gap-3">
            <img
              src={userInfo.picture}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="w-full">
              <textarea
                placeholder="댓글을 입력하세요"
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent resize-none py-2 overflow-hidden"
                rows={1}
                value={comment}
                onFocus={() => setShowButtons(true)}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          {showButtons && (
            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={() => {
                  setComment("");
                  setShowButtons(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleSubmitComment}
                className="bg-main hover:bg-point text-white px-4 py-2 rounded-md"
              >
                댓글
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {commentList.length === 0 ? (
          <div className="flex flex-col items-center pt-5 gap-2">
            <img src={commenticon} alt="commenticon" className="w-14 h-w-14" />
            <p className="font-semibold text-xl text-gray-500">
              아직 댓글이 없습니다.
            </p>
            <p className="font-medium text-sm text-gray-400">
              첫 번째 댓글을 남겨보세요!
            </p>
          </div>
        ) : (
          commentList.map((comment) => (
            <Comment
              key={comment.replyId}
              comment={comment}
              onUpdateComment={handleEditComment}
              onDeleteComment={confirmDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
