import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import mainImg from "../../assets/images/main_img.png";
import staffmark from "../../assets/icons/staffmark.svg";
import edit from "../../assets/icons/edit.svg";
import Button from "../../common/ButtonComponent";
import Input from "../../common/InputComponent";
import { useAuthStore } from "../../store/authStore";
import authAxiosInstance from "../../api/authAxiosInstance";

export default function UserProfile() {
  const { pathname } = useLocation();
  const isUserPage = pathname.includes("Userpage");

  // 전역 상태에서 사용자 정보와 액션 구독
  const { userInfo, loadUserProfileFromDB } = useAuthStore();

  // 로컬 state (초기값은 전역 userInfo를 참고)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(
    userInfo?.name || "Quokka3764"
  );
  const [description, setDescription] = useState<string>(
    userInfo?.introduction || "자기 소개글을 적어주세요"
  );
  // 프로필 이미지 URL(미리보기) 및 실제 파일 객체 저장 state
  const [profileImage, setProfileImage] = useState<string>(
    userInfo?.picture || mainImg
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 컴포넌트 마운트 시 프로필 정보 로드
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await loadUserProfileFromDB();
      } catch (error) {
        console.error("프로필 정보 로드 실패:", error);
      }
    };

    fetchProfileData();
  }, [loadUserProfileFromDB]);

  // 전역 userInfo가 변경되면 로컬 state 동기화
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.name || nickname);
      setProfileImage(userInfo.picture || profileImage);
      setDescription(userInfo.introduction || description);
    }
  }, [userInfo]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  const handleProfileUpdate = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // FormData 생성
      const formData = new FormData();

      // 텍스트 데이터를 JSON 형태로 변환
      const jsonData: Record<string, string> = {
        name: nickname,
        introduction: description,
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });
      formData.append("data", jsonBlob);

      // 프로필 이미지 처리
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      // 외부에서 import한 authAxiosInstance 사용
      const response = await authAxiosInstance.patch(
        "/api/users/profiles",
        formData
      );

      if (response.data.isSuccess) {
        // 프로필 정보 다시 로드
        await loadUserProfileFromDB();
        setIsEditing(false);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("프로필 수정 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원탈퇴 함수 추가
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        setIsLoading(true);

        // DELETE 요청 보내기
        const response = await authAxiosInstance.delete("/api/users/profiles");

        console.log("[UserProfile] 회원탈퇴 응답:", response.data);

        if (response.data.isSuccess) {
          alert("계정이 성공적으로 삭제되었습니다.");
          // 로그아웃 처리
          await useAuthStore.getState().logout();
          // 홈페이지로 리다이렉트
          window.location.href = "/";
        } else {
          alert(
            "계정 삭제 중 오류가 발생했습니다: " +
              (response.data.message || "알 수 없는 오류")
          );
        }
      } catch (error) {
        console.error("[UserProfile] 회원탈퇴 오류:", error);
        alert("계정 삭제 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {!isEditing ? (
        <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
          <img
            src={profileImage || mainImg}
            alt="UserProfile"
            className="w-[160px] h-[160px] rounded-full self-center object-cover"
          />
          <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
            {isUserPage ? (
              <p className="text-xl lg:text-2xl font-semibold mt-2">
                {nickname}
              </p>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xl lg:text-2xl font-semibold">{nickname}</p>
              </div>
            )}
            <p className="text-sm text-[#91989E]">
              {userInfo?.email || "example@gmail.com"}
            </p>
            <p
              className={`text-md text-gray-500 text-start sm:text-left ${
                isUserPage ? "w-[70%]" : "w-full"
              }`}
            >
              {description}
            </p>
            <div className="flex gap-2">
              {isUserPage ? <Button>담당자 신청</Button> : null}
              <Button onClick={handleEditClick}>
                {isLoading ? "로딩 중..." : "프로필 수정"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 수정 모드
        <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
          <div className="relative flex justify-center mb-4 sm:mb-0">
            <img
              src={profileImage}
              alt="UserProfile"
              className="w-[160px] h-[160px] rounded-full object-cover"
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <img
                src={edit}
                alt="editProfileImg"
                className="absolute right-2 bottom-8"
              />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
            {isUserPage ? (
              <Input
                value={nickname}
                placeholder="이름을 입력해주세요."
                onChange={(e) => setNickname(e.target.value)}
                className="mt-2 px-1 py-1 w-[200px]"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={nickname}
                  placeholder="이름을 입력해주세요."
                  onChange={(e) => setNickname(e.target.value)}
                  className="px-1 py-1"
                />
                <img src={staffmark} alt="스태프 인증 마크" />
              </div>
            )}
            <p className="text-sm text-[#91989E]">
              {userInfo?.email || "example@gmail.com"}
            </p>
            <textarea
              value={description}
              placeholder="소개글을 입력해주세요."
              onChange={(e) => setDescription(e.target.value)}
              className={`px-1 py-1 border-2 border-main rounded-lg resize-none outline-none focus:ring-1 focus:ring-point box-border ${
                isUserPage ? "w-[70%]" : "w-full"
              }`}
            />
            <div className="flex gap-2">
              {isUserPage ? (
                <button
                  className={`px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-point"
                  }`}
                  onClick={() => !isLoading && console.log("담당자 신청")}
                >
                  담당자 신청
                </button>
              ) : null}
              <Button onClick={!isLoading ? handleProfileUpdate : undefined}>
                {isLoading ? "처리 중..." : "수정 완료"}
              </Button>

              {/* 회원탈퇴 버튼 추가 */}
              <button
                className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={!isLoading ? handleDeleteAccount : undefined}
                disabled={isLoading}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
