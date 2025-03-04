import UserProfile from "../../components/user/UserProfile";
import UserMenu from "./components/UserMenu";
//
export default function Userpage() {
  return (
    <div className="w-full max-w-[873px] mx-auto">
      <div className="my-10">
        <UserProfile />
      </div>
      <UserMenu />
    </div>
  );
}
