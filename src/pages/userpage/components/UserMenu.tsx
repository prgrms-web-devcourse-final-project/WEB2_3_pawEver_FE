import { useState } from "react";
import { useAnimalLikeStore } from "../../../store/animalLikeStore";
import UserPost from "./UserPost";
import UserDonation from "../../../components/user/UserDonation";
import TestCard from "../../../common/TestCard";

export default function UserMenu() {
  const [selected, setSelected] = useState("내 친구들");
  const menuItems = [
    {
      name: "내 친구들",
      component: <MyFriends />,
    },
    {
      name: "작성한 글",
      component: <UserPost />,
    },

    {
      name: "후원 내역",
      component: <UserDonation />,
    },
  ];

  return (
    <div className="w-full">
      {/* 탭 버튼 */}
      <div className="mb-2 w-full flex justify-between items-center bg-[#F0F8FF] rounded-lg px-2 sm:px-4">
        <div className="w-full flex flex-row justify-between gap-2 sm:gap-0 py-2">
          {menuItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setSelected(item.name)}
              className={`text-lg text-center font-medium ${
                selected === item.name
                  ? "bg-blue-500 text-white rounded-lg"
                  : "text-gray-500"
              } ${index !== 0 ? "sm:ml-[37px]" : ""}`}
              style={{ flex: 1 }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 내용 */}
      {menuItems.find((item) => item.name === selected)?.component}
    </div>
  );
}

// "내 친구들" 탭 전용 컴포넌트
function MyFriends() {
  // 스토어에서 likedAnimalDetails를 읽어와 카드 렌더링
  const { likedAnimalDetails } = useAnimalLikeStore();

  return (
    <>
      <p className="text-sm text-[#91989E] font-normal block sm:inline sm:text-left">
        사라진 친구가 있다면 좋은 곳으로 입양 간 것일 수도 있어요!
      </p>

      {likedAnimalDetails.length === 0 ? (
        <p className="mt-2 text-gray-500">아직 좋아요한 동물이 없어요!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center place-items-center mt-4">
          {likedAnimalDetails.map((animal) => (
            <TestCard
              key={animal.id}
              desertionNo={animal.id}
              popfile={animal.imageUrl}
              kindCd={animal.name}
              careNm={animal.shelterName}
            />
          ))}
        </div>
      )}
    </>
  );
}
