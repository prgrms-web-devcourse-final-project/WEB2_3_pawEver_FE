import { Link } from "react-router-dom";
import defaultImg from "../../../assets/images/exampleAnimal.png";
import { PostType } from "../../../types/Post";
import getRelativeTime from "../../../utils/getRelativeTime";

export default function CommunityCard({
  id,
  author,
  profileImage,
  thumbnailImage,
  title,
  createdAt,
}: PostType) {
  return (
    <Link to={`/community/${id}`} className="cursor-pointer">
      <div className="w-full min-w-[150px] max-w-[320px] bg-white rounded-lg shadow-md flex flex-col">
        {/* 16:9 비율 유지 */}
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={thumbnailImage ? thumbnailImage : defaultImg}
            alt="thumbnail"
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="m-3">
          <p className="font-medium text-xl">{title}</p>
          <div className="flex gap-1 items-center text-xs text-gray-500">
            <img
              src={profileImage}
              alt="userprofileimg"
              className="w-6 h-6 rounded-full"
            />
            <p>{author}</p>
            <p className="pl-1">
              {getRelativeTime(new Date(createdAt).getTime())}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
