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

export default function CommentSection({
  post_Id,
}: {
  post_Id: number | undefined;
}) {
  const { userInfo } = useAuthStore();

  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [comment, setComment] = useState<string>("");
  const [showButtons, setShowButtons] = useState(false);

  // 댓글 목록
  const getCommentData = async () => {
    if (!post_Id) return;
    try {
      const data = await getComment(post_Id);
      console.log("댓글", data);
      setCommentList(data.replies);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!post_Id) return;
    getCommentData();
  }, [post_Id]);

  // 댓글 등록
  const handleSubmitComment = async () => {
    if (!post_Id || !comment.trim()) return;
    try {
      const response = await createComment(post_Id, comment);
      setComment("");
      setShowButtons(false);
      setCommentList((prev) => [...prev, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  // 댓글 삭제
  const confirmDelete = async (postId: number, replyId: number) => {
    if (!postId || !replyId) return;

    try {
      await deleteComment(postId, replyId);
      setCommentList((prev) =>
        prev.filter((comment) => comment.replyId !== replyId)
      );
    } catch (err) {
      console.log("게시글 삭제 실패", err);
    }
  };

  // 댓글 수정
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
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <span className="text-lg font-semibold">댓글 {commentList.length}개</span>
      {/* 댓글 입력 */}
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

      {/* 댓글 목록 */}
      <div className="mt-6 space-y-4">
        {commentList.length === 0 ? (
          <p>작성된 댓글이 없습니다!</p>
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
