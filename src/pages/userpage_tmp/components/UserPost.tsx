import useritem_img from "../../../assets/images/useritem_img.svg";

export default function UserPost() {
  return (
    <button className="flex w-full max-w-[873px] h-[180px] text-start">
      <img
        src={useritem_img}
        alt="사이드 이미지"
        className="ml-4 w-10 h-full"
      />
      <div className="ml-4 mt-5">
        <div className="font-semibold text-[22px] md:text-[25px] w-[300px] md:w-[400px] line-clamp-1">
          남기고 싶은 말: 좋은 곳에 사용해주시면
          감사하겠습니다.감사하겠습니다.감사하겠습니다.
        </div>
        <div className="mt-2 font-semibold text-[16px] md:text-[18px] text-[#91989E]">
          <p className="mb-6 md:mb-4 w-[300px] md:w-[400px] line-clamp-2">
            포메라니안 입양후기 귀여움귀여움귀여움귀여움귀여움귀여움포메라니안
            입양후기 귀여움귀여움귀여움귀여움귀여움귀여움
          </p>
          <p>작성일 2025.02.24</p>
        </div>
      </div>
    </button>
  );
}
