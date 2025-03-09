import { useEffect, useState } from "react";
import { getComment } from "../../../api/fetchComment";
import getRelativeTime from "../../../utils/getRelativeTime";
import { useNavigate } from "react-router-dom";

interface CommentType {
  replyId: number;
  userId: number;
  username: string;
  profileImageUrl: string;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export default function CommentSection({ post_Id }: { post_Id: string }) {
  const navigate = useNavigate();

  const [commentList, setCommentList] = useState<CommentType[] | null>(null);
  const [showButtons, setShowButtons] = useState(false);

  const getCommentData = async (post_Id: string) => {
    try {
      const data = await getComment(post_Id);
      console.log("댓글", data);
      setCommentList(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!post_Id) return;
    getCommentData(post_Id);
  }, [post_Id]);

  if (!commentList) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div>
      <span className="text-lg font-semibold">댓글 {commentList.length}개</span>
      {/* 댓글 입력 */}
      {/* <div className="mt-4">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="w-full">
              <textarea
                ref={textareaRef}
                placeholder="댓글을 입력하세요."
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
                // onClick={() => {
                //   setComment("");
                //   setShowButtons(false);
                // }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                // onClick={handleAddComment}
                className="bg-main hover:bg-point text-white px-4 py-2 rounded-md"
              >
                댓글
              </button>
            </div>
          )}
        </div> */}

      {/* 댓글 목록 */}
      <div className="mt-6 space-y-4">
        {commentList.map((comment) => (
          <div key={comment.replyId} className="flex items-start">
            <img
              src={comment.profileImageUrl}
              alt="Comment User Avatar"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="bg-gray-100 rounded-md p-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {comment.username}
                </span>
                <span className="text-xs text-gray-400">
                  {getRelativeTime(new Date(comment.createdAt).getTime())}
                </span>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                {comment.content}
              </div>

              {/* 삭제 버튼: 본인 댓글인 경우에만 표시 */}
              {/* {comment.userId === currentUser.id && (
                  <button
                    className="text-xs text-red-500 mt-2"
                    // onClick={() => handleDeleteComment(item.id, item.authorId)}
                  >
                    삭제
                  </button>
                )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
