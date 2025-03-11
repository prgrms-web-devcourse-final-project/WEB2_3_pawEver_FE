import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { CommentType } from "../../../types/Comment";
import DeleteModal from "./DeleteModal";
import formatDate from "../../../utils/formatDate";

interface CommentProps {
  comment: CommentType;
  onUpdateComment: (
    postId: number,
    replyId: number,
    editcomment: string
  ) => void;
  onDeleteComment: (postId: number, replyId: number) => void;
}

export default function Comment({
  comment,
  onUpdateComment,
  onDeleteComment,
}: CommentProps) {
  const { userInfo } = useAuthStore();
  const isAuthor = userInfo?.id === comment.userUuid;

  const [edit, setEdit] = useState<boolean>(false);
  const [editcomment, setEditcomment] = useState<string>(comment.content);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  return edit ? (
    <div className="flex">
      <img
        src={comment.profileImageUrl}
        alt="Comment User Avatar"
        className="w-10 h-10 rounded-full mr-3 object-cover"
      />
      <div className="bg-gray-100 rounded-md p-3 w-full flex flex-col">
        <span className="text-sm font-semibold mb-2">{comment.username}</span>
        <textarea
          placeholder="댓글을 입력해주세요"
          value={editcomment}
          onChange={(e) => setEditcomment(e.target.value)}
          className="text-sm text-gray-700 px-1 resize-none bg-transparent focus:outline-none border-2 border-gray-600 rounded overflow-hidden"
        >
          {comment.content}
        </textarea>
        <div className="flex justify-end ">
          <button
            className="text-xs text-gray-500 mt-2 mr-2"
            onClick={() => {
              onUpdateComment(comment.postId, comment.replyId, editcomment);
              setEdit(false);
            }}
          >
            등록
          </button>
        </div>
      </div>
      {deleteModalOpen && (
        <DeleteModal
          onCancel={cancelDelete}
          onConfirm={() => {
            onDeleteComment(comment.postId, comment.replyId);
            setDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  ) : (
    <div className="flex items-start">
      <img
        src={comment.profileImageUrl}
        alt="Comment User Avatar"
        className="w-10 h-10 rounded-full mr-3 object-cover"
      />
      <div className="bg-gray-100 rounded-md p-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{comment.username}</span>
          <span className="text-xs text-gray-400">
            {formatDate(
              comment.updatedAt ? comment.updatedAt : comment.createdAt
            )}
          </span>
        </div>
        <div className="text-sm text-gray-700 mt-1">{comment.content}</div>
        {isAuthor && (
          <div className="text-xs mt-2">
            <button
              className="text-gray-500 mr-2"
              onClick={() => setEdit(true)}
            >
              수정
            </button>
            <button
              className="text-red-500"
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          onCancel={cancelDelete}
          onConfirm={() => {
            onDeleteComment(comment.postId, comment.replyId);
            setDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
