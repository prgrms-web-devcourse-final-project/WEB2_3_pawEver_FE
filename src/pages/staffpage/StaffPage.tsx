import UserProfile from "../../components/user/UserProfile";
import StaffMenu from "./components/StaffMenu";
//
export default function StaffPage() {
  return (
    <div className="w-full max-w-[873px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full grid grid-cols-1 sm:grid-cols-[7fr_3fr] items-center gap-10 my-10">
        <UserProfile />
        <div className="flex flex-row sm:flex-col justify-between mx-3 ">
          <div>
            <p className="text-lg text-[#5F656C]">보호센터명</p>
            <p className="font-semibold text-lg">포켓멍센터</p>
          </div>
          <div>
            <p className="text-lg text-[#5F656C]">보호소 전화번호</p>
            <p className="font-semibold text-lg">062-458-4964</p>
          </div>
          <div>
            <p className="text-lg text-[#5F656C]">담당자 연락처</p>
            <p className="font-semibold text-lg">010-4565-8984</p>
          </div>
        </div>
      </div>
      <StaffMenu />
    </div>
  );
}
