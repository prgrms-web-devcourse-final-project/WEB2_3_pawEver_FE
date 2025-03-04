import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import harpSeal from "../../assets/images/harp seal.jpg";
import graySeal from "../../assets/images/Greay Seal.jpg";

// 상대 시간 표시 함수.
function getRelativeTimeString(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) {
    return "방금 전";
  }

  const diffMinutes = Math.floor(diff / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `${diffWeeks}주 전`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}달 전`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}년 전`;
}

//dummy data
export default function CommunityDetail() {
  const currentUser = {
    id: 999,
    name: "로그인 유저",
    avatar: harpSeal,
  };

  const [comment, setComment] = useState("");
  const [showButtons, setShowButtons] = useState(false);

  //dummy comments
  const [comments, setComments] = useState([
    {
      id: 1,
      authorId: 101,
      author: "댓글 작성자",
      text: "너무 귀여운 물범이네요! 입양 축하드려요ㅎㅎㅎㅎㅎㅎㅎ",
      avatar: graySeal,
      createdAt: Date.now() - 1000 * 60 * 3, // 3분 전
    },
    {
      id: 2,
      authorId: 102,
      author: "댓글 작성자2",
      text: "좋은 정보 감사해요! 그런데 제가 생각한 물범은 아니네요 ㅠ",
      avatar: graySeal,
      createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
    },
    {
      id: 3,
      authorId: 103,
      author: "댓글 작성자3",
      text: "와 진짜 크다",
      avatar: graySeal,
      createdAt: Date.now() - 1000 * 60, // 1분 전
    },
  ]);

  // textarea 자동 높이 조절
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [comment]);

  /**
   * @remarks
   * - targetCommentId : 삭제할 댓글 ID
   * - null이면 모달 표시 없이 대기
   *
   * @description
   * useState로 관리하는 댓글 ID (삭제 확인 모달)
   */
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null);

  //댓글작성(임시)
  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      authorId: currentUser.id,
      author: currentUser.name,
      text: comment.trim(),
      avatar: currentUser.avatar,
      createdAt: Date.now(),
    };

    setComments((prev) => [...prev, newComment]);
    setComment("");
    setShowButtons(false);

    toast.success("댓글이 작성되었습니다.", {
      duration: 3000,
      position: "top-right",
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
  };

  //댓글삭제(임시)
  const handleDeleteComment = (id: number, authorId: number) => {
    if (authorId !== currentUser.id) {
      toast.error("본인 댓글만 삭제할 수 있습니다.", {
        style: {
          background: "#FFEBEE",
          color: "#D32F2F",
        },
      });
      return;
    }
    setTargetCommentId(id);
  };

  /**
   * 실제 삭제 실행 - 모달 내 '삭제' 버튼 클릭 시
   */
  const confirmDeleteComment = () => {
    if (targetCommentId == null) return;
    setComments((prev) => prev.filter((c) => c.id !== targetCommentId));
    toast.success("댓글이 삭제되었습니다.", {
      style: {
        background: "#09ACFB",
        color: "#FFFFFF",
      },
      position: "top-right",
      iconTheme: {
        primary: "#FFFFFF",
        secondary: "#09ACFB",
      },
    });
    setTargetCommentId(null);
  };

  //모달 취소 버튼 클릭

  const cancelDeleteComment = () => {
    setTargetCommentId(null);
  };

  return (
    <section className="w-full my-8">
      <div className="max-w-[640px] mx-auto px-4">
        {/* 동물 카드 (임시 이미지) */}
        <img src={graySeal} alt="대체 이미지" className="object-cover w-full" />

        {/* 게시물 제목, 작성자, 시간 */}
        <h1 className="text-2xl font-bold mt-6">
          물범을 입양했습니다!!! (title)
        </h1>
        <div className="text-sm text-gray-500 mt-2">
          <span className="mr-2">작성자: (닉네임)</span>
          <span className="mr-2">2025년 2월 14일</span>
          <span>2시간 전</span>
        </div>

        {/* 게시물 본문 내용 */}
        <div className="mt-6 text-base leading-relaxed">
          <p>
            어제 데리고 왔는데 너무 귀여워요! 그런데 제가 처음 입양해봐서 그런지
            어떤 사료가 좋은지 모르겠는데 추천해주세요 !!!! 🐣 진짜 무겁네요....
            너무많이먹을거같아요;; (content)
          </p>
        </div>

        {/* 댓글 섹션 */}
        <div className="mt-8">
          <span className="text-lg font-semibold">
            댓글 {comments.length}개
          </span>
          {/* 댓글 입력 */}
          <div className="mt-4">
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
                  onClick={() => {
                    setComment("");
                    setShowButtons(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleAddComment}
                  className="bg-main hover:bg-point text-white px-4 py-2 rounded-md"
                >
                  댓글
                </button>
              </div>
            )}
          </div>

          {/* 댓글 목록 */}
          <div className="mt-6 space-y-4">
            {comments.map((item) => (
              <div key={item.id} className="flex items-start">
                <img
                  src={item.avatar}
                  alt="Comment User Avatar"
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="bg-gray-100 rounded-md p-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{item.author}</span>
                    <span className="text-xs text-gray-400">
                      {getRelativeTimeString(item.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{item.text}</div>
                  {/* 삭제 버튼: 본인 댓글인 경우에만 표시 */}
                  {item.authorId === currentUser.id && (
                    <button
                      className="text-xs text-red-500 mt-2"
                      onClick={() =>
                        handleDeleteComment(item.id, item.authorId)
                      }
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 삭제확인 모달*/}
      {targetCommentId !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-md p-6 shadow-lg w-[300px]">
            <p className="text-sm font-medium mb-4">정말 삭제하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                onClick={cancelDeleteComment}
              >
                취소
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={confirmDeleteComment}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
