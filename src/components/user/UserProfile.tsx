import { useState } from "react";
import { useLocation } from "react-router-dom";
import mainImg from "../../assets/images/main_img.png";
import staffmark from "../../assets/icons/staffmark.svg";
import edit from "../../assets/icons/edit.svg";
import Button from "../../common/ButtonComponent";
import Input from "../../common/InputComponent";

export default function UserProfile() {
  const { pathname } = useLocation();
  const isUserPage = pathname.includes("Userpage");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("Quokka3764");
  const [description, setDescription] = useState<string>(
    "저희 사이트는 유기동물을 입양할 수 있도록 최선을 다하고 있습니다. 후원 내역이 궁금하시다면 문의해주세요. "
  );
  const [profileImage, setProfileImage] = useState<string>(mainImg);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {!isEditing ? (
        <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
          <img
            src={mainImg}
            alt="UserProfile"
            className="w-[160px] h-[160px] rounded-full self-center"
          />
          <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
            {isUserPage ? (
              <p className="text-xl lg:text-2xl font-semibold mt-2">
                {nickname}
              </p>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xl lg:text-2xl font-semibold">Quokka3764</p>
                <img src={staffmark} alt="스태프 인증 마크" />
              </div>
            )}

            <p className="text-sm text-[#91989E]">example@gmail.com</p>
            <p
              className={`text-md text-gray-500 text-start sm:text-left ${
                isUserPage ? "w-[70%]" : "w-full"
              }`}
            >
              {description}
            </p>
            <div className="flex gap-2">
              {isUserPage ? <Button>담당자 신청</Button> : null}
              <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
            </div>
          </div>
        </div>
      ) : (
        // 수정
        <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
          <div className="relative flex justify-center mb-4 sm:mb-0">
            <img
              src={profileImage}
              alt="UserProfile"
              className="w-[160px] h-[160px] rounded-full"
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <img
                src={edit}
                alt="editProfileImg"
                className="absolute right-2 bottom-8 "
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
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                className="mt-2 px-1 py-1 w-[200px]"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={nickname}
                  placeholder="이름을 입력해주세요."
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  className="px-1 py-1"
                />
                <img src={staffmark} alt="스태프 인증 마크" />
              </div>
            )}

            <p className="text-sm text-[#91989E]">example@gmail.com</p>
            <textarea
              value={description}
              placeholder="소개글을 입력해주세요."
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className={`px-1 py-1 border-2 border-main rounded-lg resize-none outline-none focus:ring-1 focus:ring-point box-border ${
                isUserPage ? "w-[70%]" : "w-full"
              }`}
            />
            <div className="flex gap-2">
              {isUserPage ? (
                <button
                  disabled={isEditing}
                  className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white hover:bg-point"
                >
                  담당자 신청
                </button>
              ) : null}
              <Button onClick={() => setIsEditing(false)}>수정 완료</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
