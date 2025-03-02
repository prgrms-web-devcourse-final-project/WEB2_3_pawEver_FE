import { useState } from "react";
import AnimalCard from "../../../common/AnimalCard";
import UserReservation from "../../../components/user/UserReservation";

export default function StaffMenu() {
  const staffMenuItems = [
    { name: "예약 확인", component: <UserReservation /> },
    { name: "보호중인 친구들", component: <AnimalCard /> },
  ];
  const [selectedMenu, setSelectedMenu] = useState<string>("예약 확인");

  return (
    <div className="w-full max-w-[873px]">
      <div className="mb-2 w-full max-w-[873px] flex justify-between items-center bg-[#F0F8FF] rounded-lg px-2 sm:px-4">
        <div className="w-full flex flex-row justify-between gap-2 sm:gap-0 py-2">
          {staffMenuItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setSelectedMenu(item.name)}
              className={`text-lg text-center font-medium ${
                selectedMenu === item.name
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
      {staffMenuItems.find((item) => selectedMenu === item.name)?.component}
    </div>
  );
}
