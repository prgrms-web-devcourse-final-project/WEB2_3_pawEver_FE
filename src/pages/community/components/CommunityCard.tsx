import { Link } from "react-router-dom";
import defaultImg from "../../../assets/images/defaultThumbnail.svg";
import { PostType } from "../../../types/Post";
import formatDate from "../../../utils/formatDate";

export default function CommunityCard({
  id,
  author,
  profileImage,
  thumbnailImage,
  title,
  createdAt,
  updatedAt,
}: PostType) {
  return (
    <Link to={`/community/${id}`} className="cursor-pointer">
      <div className="w-full min-w-[150px] max-w-[320px] bg-white rounded-lg shadow-md flex flex-col">
        <div className="w-full aspect-video overflow-hidden rounded-t-lg shadow-sm">
          <img
            src={thumbnailImage ? thumbnailImage : defaultImg}
            alt="thumbnail"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="m-3">
          <p className="font-medium text-xl line-clamp-1">{title}</p>
          <div className="flex gap-1 items-center text-xs text-gray-500">
            <img
              src={profileImage}
              alt="userprofileimg"
              className="w-6 h-6 rounded-full"
            />
            <p>{author}</p>
            <p className="pl-1">
              {formatDate(updatedAt ? updatedAt : createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
