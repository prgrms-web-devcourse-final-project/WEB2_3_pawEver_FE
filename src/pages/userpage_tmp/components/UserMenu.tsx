import { useState } from "react";
import AnimalCard from "../../../common/AnimalCard";
import UserPost from "./UserPost";
import UserReservation from "../../../components/user/UserReservation";
import UserDonation from "../../../components/user/UserDonation";

export default function UserMenu() {
  const [selected, setSelected] = useState<string>("내 친구들");
  const menuItems = [
    { name: "내 친구들", component: <AnimalCard /> },
    { name: "작성한 글", component: <UserPost /> },
    { name: "예약 내역", component: <UserReservation /> },
    { name: "후원 내역", component: <UserDonation /> },
  ];

  return (
    <div className="w-full ">
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
              style={{
                flex: 1,
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      {selected === "내 친구들" ? (
        <>
          <p className="text-sm text-[#91989E] font-normal block sm:inline sm:text-left">
            사라진 친구가 있다면 좋은 곳으로 입양을 간것입니다!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4  justify-center place-items-center">
            {menuItems.find((item) => selected === item.name)?.component}
          </div>
        </>
      ) : (
        menuItems.find((item) => selected === item.name)?.component
      )}
    </div>
  );
}
