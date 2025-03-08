// import { useState } from "react";
// import { useLocation } from "react-router-dom";
// import mainImg from "../../assets/images/main_img.png";
// import staffmark from "../../assets/icons/staffmark.svg";
// import edit from "../../assets/icons/edit.svg";
// import Button from "../../common/ButtonComponent";
// import Input from "../../common/InputComponent";

// export default function UserProfile() {
//   const { pathname } = useLocation();
//   const isUserPage = pathname.includes("Userpage");

//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [nickname, setNickname] = useState<string>("Quokka3764");
//   const [description, setDescription] = useState<string>(
//     "저희 사이트는 유기동물을 입양할 수 있도록 최선을 다하고 있습니다. 후원 내역이 궁금하시다면 문의해주세요. "
//   );
//   const [profileImage, setProfileImage] = useState<string>(mainImg);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <>
//       {!isEditing ? (
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <img
//             src={mainImg}
//             alt="UserProfile"
//             className="w-[160px] h-[160px] rounded-full self-center object-cover"
//           />
//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <p className="text-xl lg:text-2xl font-semibold mt-2">
//                 {nickname}
//               </p>
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <p className="text-xl lg:text-2xl font-semibold">
//                   name바인딩하는 자리
//                 </p>
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}

//             <p className="text-sm text-[#91989E]">
//               example@gmail.com, 이메일 주소 넣는 자리
//             </p>
//             <p
//               className={`text-md text-gray-500 text-start sm:text-left ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             >
//               {description}
//             </p>
//             <div className="flex gap-2">
//               {isUserPage ? <Button>담당자 신청</Button> : null}
//               <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // 수정
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <div className="relative flex justify-center mb-4 sm:mb-0">
//             <img
//               src={profileImage}
//               alt="UserProfile"
//               className="w-[160px] h-[160px] rounded-full"
//             />
//             <label htmlFor="imageUpload" className="cursor-pointer">
//               <img
//                 src={edit}
//                 alt="editProfileImg"
//                 className="absolute right-2 bottom-8 "
//               />
//             </label>

//             <input
//               id="imageUpload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </div>

//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <Input
//                 value={nickname}
//                 placeholder="이름을 입력해주세요."
//                 onChange={(e) => {
//                   setNickname(e.target.value);
//                 }}
//                 className="mt-2 px-1 py-1 w-[200px]"
//               />
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <Input
//                   value={nickname}
//                   placeholder="이름을 입력해주세요."
//                   onChange={(e) => {
//                     setNickname(e.target.value);
//                   }}
//                   className="px-1 py-1"
//                 />
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}

//             <p className="text-sm text-[#91989E]">example@gmail.com</p>
//             <textarea
//               value={description}
//               placeholder="소개글을 입력해주세요."
//               onChange={(e) => {
//                 setDescription(e.target.value);
//               }}
//               className={`px-1 py-1 border-2 border-main rounded-lg resize-none outline-none focus:ring-1 focus:ring-point box-border ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             />
//             <div className="flex gap-2">
//               {isUserPage ? (
//                 <button
//                   disabled={isEditing}
//                   className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white hover:bg-point"
//                 >
//                   담당자 신청
//                 </button>
//               ) : null}
//               <Button onClick={() => setIsEditing(false)}>수정 완료</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// 15:27분 서버응답갑 확인버전

// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import mainImg from "../../assets/images/main_img.png";
// import staffmark from "../../assets/icons/staffmark.svg";
// import edit from "../../assets/icons/edit.svg";
// import Button from "../../common/ButtonComponent";
// import Input from "../../common/InputComponent";
// import { useAuthStore } from "../../store/authStore";
// import { updateUserProfile } from "../../api/updateUserProfile";

// export default function UserProfile() {
//   const { pathname } = useLocation();
//   const isUserPage = pathname.includes("Userpage");

//   // Zustand에서 사용자 정보 가져오기
//   const { userInfo } = useAuthStore();

//   // 로컬 state (기존 기본값 및 Zustand userInfo 반영)
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [nickname, setNickname] = useState<string>(
//     userInfo?.name || "Quokka3764"
//   );
//   const [description, setDescription] = useState<string>(
//     "저희 사이트는 유기동물을 입양할 수 있도록 최선을 다하고 있습니다. 후원 내역이 궁금하시다면 문의해주세요. "
//   );
//   // 프로필 이미지 URL (미리보기용)와 실제 파일 객체를 저장하는 state
//   const [profileImage, setProfileImage] = useState<string>(
//     userInfo?.picture || mainImg
//   );
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   useEffect(() => {
//     if (userInfo) {
//       setNickname(userInfo.name);
//       setProfileImage(userInfo.picture || mainImg);
//     }
//   }, [userInfo]);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfileUpdate = async () => {
//     try {
//       const response = await updateUserProfile({
//         name: nickname,
//         introduction: description,
//         profileImage: selectedFile!, // 파일이 반드시 선택되었다고 가정
//       });
//       console.log("프로필 수정 응답:", response);
//       setIsEditing(false);
//     } catch (err) {
//       console.error("프로필 수정 오류:", err);
//       // 에러 처리 로직 추가 가능
//     }
//   };

//   return (
//     <>
//       {!isEditing ? (
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <img
//             src={userInfo?.picture || mainImg}
//             alt="UserProfile"
//             className="w-[160px] h-[160px] rounded-full self-center object-cover"
//           />
//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <p className="text-xl lg:text-2xl font-semibold mt-2">
//                 {userInfo?.name || nickname}
//               </p>
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <p className="text-xl lg:text-2xl font-semibold">
//                   {userInfo?.name || "name"}
//                 </p>
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}
//             <p className="text-sm text-[#91989E]">
//               {userInfo?.email || "example@gmail.com"}
//             </p>
//             <p
//               className={`text-md text-gray-500 text-start sm:text-left ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             >
//               {description}
//             </p>
//             <div className="flex gap-2">
//               {isUserPage ? <Button>담당자 신청</Button> : null}
//               <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // 수정 모드
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <div className="relative flex justify-center mb-4 sm:mb-0">
//             <img
//               src={profileImage}
//               alt="UserProfile"
//               className="w-[160px] h-[160px] rounded-full"
//             />
//             <label htmlFor="imageUpload" className="cursor-pointer">
//               <img
//                 src={edit}
//                 alt="editProfileImg"
//                 className="absolute right-2 bottom-8"
//               />
//             </label>
//             <input
//               id="imageUpload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </div>
//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <Input
//                 value={nickname}
//                 placeholder="이름을 입력해주세요."
//                 onChange={(e) => setNickname(e.target.value)}
//                 className="mt-2 px-1 py-1 w-[200px]"
//               />
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <Input
//                   value={nickname}
//                   placeholder="이름을 입력해주세요."
//                   onChange={(e) => setNickname(e.target.value)}
//                   className="px-1 py-1"
//                 />
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}
//             <p className="text-sm text-[#91989E]">
//               {userInfo?.email || "example@gmail.com"}
//             </p>
//             <textarea
//               value={description}
//               placeholder="소개글을 입력해주세요."
//               onChange={(e) => setDescription(e.target.value)}
//               className={`px-1 py-1 border-2 border-main rounded-lg resize-none outline-none focus:ring-1 focus:ring-point box-border ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             />
//             <div className="flex gap-2">
//               {isUserPage ? (
//                 <button
//                   disabled={isEditing}
//                   className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white hover:bg-point"
//                 >
//                   담당자 신청
//                 </button>
//               ) : null}
//               <Button onClick={handleProfileUpdate}>수정 완료</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

//일단 중간성공임. 하지만 모두 변경해서 보내야함

// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import mainImg from "../../assets/images/main_img.png";
// import staffmark from "../../assets/icons/staffmark.svg";
// import edit from "../../assets/icons/edit.svg";
// import Button from "../../common/ButtonComponent";
// import Input from "../../common/InputComponent";
// import { useAuthStore } from "../../store/authStore";
// import { updateUserProfile } from "../../api/updateUserProfile";

// export default function UserProfile() {
//   const { pathname } = useLocation();
//   const isUserPage = pathname.includes("Userpage");

//   // 전역 상태에서 사용자 정보와 업데이트 액션 구독 (persist된 데이터를 사용)
//   const { userInfo, updateUserInfo } = useAuthStore();

//   // 로컬 state (초기값은 전역 userInfo를 참고)
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [nickname, setNickname] = useState<string>(
//     userInfo?.name || "Quokka3764"
//   );
//   const [description, setDescription] = useState<string>(
//     // introduction 필드가 store에 없다면, 이를 추가하는 것이 좋습니다.
//     userInfo?.introduction ||
//       "저희 사이트는 유기동물을 입양할 수 있도록 최선을 다하고 있습니다. 후원 내역이 궁금하시다면 문의해주세요."
//   );
//   // 프로필 이미지 URL (미리보기) 및 실제 파일 객체 저장 state
//   const [profileImage, setProfileImage] = useState<string>(
//     userInfo?.picture || mainImg
//   );
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // 전역 userInfo가 변경되면 로컬 state 동기화
//   useEffect(() => {
//     if (userInfo) {
//       setNickname(userInfo.name);
//       setProfileImage(userInfo.picture || mainImg);
//       setDescription(userInfo.introduction || "");
//     }
//   }, [userInfo]);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (typeof reader.result === "string") {
//           setProfileImage(reader.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleProfileUpdate = async () => {
//     try {
//       const response = await updateUserProfile({
//         name: nickname,
//         introduction: description,
//         profileImage: selectedFile!, // 파일이 반드시 선택되었다고 가정
//       });
//       console.log("프로필 수정 응답:", response);
//       // 전역 상태도 함께 업데이트 (이렇게 해야 persist된 데이터가 갱신됩니다)
//       updateUserInfo({
//         name: nickname,
//         picture: profileImage,
//         introduction: description,
//       });
//       setIsEditing(false);
//     } catch (err) {
//       console.error("프로필 수정 오류:", err);
//       // 추가 에러 처리 가능
//     }
//   };

//   return (
//     <>
//       {!isEditing ? (
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <img
//             src={profileImage || mainImg}
//             alt="UserProfile"
//             className="w-[160px] h-[160px] rounded-full self-center object-cover"
//           />
//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <p className="text-xl lg:text-2xl font-semibold mt-2">
//                 {nickname}
//               </p>
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <p className="text-xl lg:text-2xl font-semibold">{nickname}</p>
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}
//             <p className="text-sm text-[#91989E]">
//               {userInfo?.email || "example@gmail.com"}
//             </p>
//             <p
//               className={`text-md text-gray-500 text-start sm:text-left ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             >
//               {description}
//             </p>
//             <div className="flex gap-2">
//               {isUserPage ? <Button>담당자 신청</Button> : null}
//               <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // 수정 모드
//         <div className="w-full max-w-[873px] flex flex-col sm:flex-row justify-between">
//           <div className="relative flex justify-center mb-4 sm:mb-0">
//             <img
//               src={profileImage}
//               alt="UserProfile"
//               className="w-[160px] h-[160px] rounded-full"
//             />
//             <label htmlFor="imageUpload" className="cursor-pointer">
//               <img
//                 src={edit}
//                 alt="editProfileImg"
//                 className="absolute right-2 bottom-8"
//               />
//             </label>
//             <input
//               id="imageUpload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </div>
//           <div className="flex flex-col gap-2 w-full sm:w-[calc(100%-160px-32px)] items-center sm:items-start">
//             {isUserPage ? (
//               <Input
//                 value={nickname}
//                 placeholder="이름을 입력해주세요."
//                 onChange={(e) => setNickname(e.target.value)}
//                 className="mt-2 px-1 py-1 w-[200px]"
//               />
//             ) : (
//               <div className="flex items-center gap-2 mt-2">
//                 <Input
//                   value={nickname}
//                   placeholder="이름을 입력해주세요."
//                   onChange={(e) => setNickname(e.target.value)}
//                   className="px-1 py-1"
//                 />
//                 <img src={staffmark} alt="스태프 인증 마크" />
//               </div>
//             )}
//             <p className="text-sm text-[#91989E]">
//               {userInfo?.email || "example@gmail.com"}
//             </p>
//             <textarea
//               value={description}
//               placeholder="소개글을 입력해주세요."
//               onChange={(e) => setDescription(e.target.value)}
//               className={`px-1 py-1 border-2 border-main rounded-lg resize-none outline-none focus:ring-1 focus:ring-point box-border ${
//                 isUserPage ? "w-[70%]" : "w-full"
//               }`}
//             />
//             <div className="flex gap-2">
//               {isUserPage ? (
//                 <button
//                   disabled={isEditing}
//                   className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white hover:bg-point"
//                 >
//                   담당자 신청
//                 </button>
//               ) : null}
//               <Button onClick={handleProfileUpdate}>수정 완료</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

//UX개선 버전

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import mainImg from "../../assets/images/main_img.png";
import staffmark from "../../assets/icons/staffmark.svg";
import edit from "../../assets/icons/edit.svg";
import Button from "../../common/ButtonComponent";
import Input from "../../common/InputComponent";
import { useAuthStore } from "../../store/authStore";
import { updateUserProfile } from "../../api/updateUserProfile";

export default function UserProfile() {
  const { pathname } = useLocation();
  const isUserPage = pathname.includes("Userpage");

  // 전역 상태에서 사용자 정보와 업데이트 액션 구독 (persist된 데이터를 사용)
  const { userInfo, updateUserInfo } = useAuthStore();

  // 로컬 state (초기값은 전역 userInfo를 참고)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(
    userInfo?.name || "Quokka3764"
  );
  const [description, setDescription] = useState<string>(
    userInfo?.introduction ||
      "저희 사이트는 유기동물을 입양할 수 있도록 최선을 다하고 있습니다. 후원 내역이 궁금하시다면 문의해주세요."
  );
  // 프로필 이미지 URL(미리보기) 및 실제 파일 객체 저장 state
  const [profileImage, setProfileImage] = useState<string>(
    userInfo?.picture || mainImg
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 전역 userInfo가 변경되면 로컬 state 동기화
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.name);
      setProfileImage(userInfo.picture || mainImg);
      setDescription(userInfo.introduction || "");
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

  const handleProfileUpdate = async () => {
    try {
      // updateUserProfile 함수는 전달된 필드만 업데이트하도록 되어 있으므로,
      // 프로필 이미지는 변경하지 않은 경우 null이 전달됩니다.
      const response = await updateUserProfile({
        name: nickname,
        introduction: description,
        profileImage: selectedFile, // 변경된 이미지가 없으면 null
      });
      console.log("프로필 수정 응답:", response);
      // 전역 상태도 함께 업데이트하여 persist된 데이터가 갱신되도록 함
      updateUserInfo({
        name: nickname,
        picture: profileImage,
        introduction: description,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("프로필 수정 오류:", err);
      // 추가 에러 처리 가능
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
                <img src={staffmark} alt="스태프 인증 마크" />
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
              <Button onClick={() => setIsEditing(true)}>프로필 수정</Button>
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
              className="w-[160px] h-[160px] rounded-full"
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
                  disabled={isEditing}
                  className="px-4 py-2 rounded-lg font-bold flex items-center justify-center border-solid border-2 bg-main text-white hover:bg-point"
                >
                  담당자 신청
                </button>
              ) : null}
              <Button onClick={handleProfileUpdate}>수정 완료</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
