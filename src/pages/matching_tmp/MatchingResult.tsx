import restart from "../../assets/icons/return.svg";
import share from "../../assets/images/matchingShare.svg";
import urlShare from "../../assets/icons/urlShare.svg";
import kakaotalkShare from "../../assets/icons/kakaotalkShare.svg";
import MatchingCard from "./components/MatchingCard";
import Button from "../../common/ButtonComponent";
//
export default function MatchingResult() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center my-8 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 mb-4 w-full">
          <div className="flex flex-col items-center md:justify-center mt-3 w-full">
            <p className="text-[16px] text-[#5F656C]">
              당신에게 가장 잘 어울리는 반려 동물은
            </p>
            <p className="font-bold text-[48px] my-2">시바견</p>
            <img
              src="https://i.pinimg.com/236x/4e/67/c3/4e67c3bff5ee4ac9ede63876f71e73c5.jpg"
              alt="매칭 결과 동물"
              className="w-[250px] h-[255px] aspect-auto rounded-xl"
            />
          </div>
          {/* 오른쪽 */}
          <div className="w-full max-w-[680px] h-[380px] rounded-2xl border border-[#E1E4E7] text-[14px] px-5 py-8 ">
            <h3 className="font-semibold text-[#474C53]">수명</h3>
            <p className="text-[#5F656C] mt-1">10-15년</p>
            <hr className="my-4 border-gray-300" />

            <h3 className="font-semibold text-[#474C53]">성격</h3>
            <p className="text-[#5F656C] mt-1">대체로 온순</p>
            <hr className="my-4 border-gray-300" />

            <h3>주의사항</h3>
            <ul className="list-disc mt-1 pl-4">
              {[...Array(3)].map((_, index) => (
                <li key={index} className="mb-2">
                  큰소리와 갑작스런 돌발상황에 민감해요
                  <p className="text-[12px] text-[#B8B8B8] pl-2">
                    아이를 키우는 가정에선 추천드리지 않아요!
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 가운데 */}
        <p className="font-bold text-[20px] mb-1 ml-8 md:self-start">
          시바견이 마음에 든다면?
        </p>
        <p className="text-[16px] text-[#5F656C] mb-2">내 근처의 시바견</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full pl-4">
          <MatchingCard />
          <MatchingCard />
          <MatchingCard />
          <MatchingCard />
        </div>

        {/* 아래 */}
        <div className="flex flex-col md:flex-row items-center gap-2 mt-9 w-full">
          <Button className="w-[420px] h-[118px]">
            <p className="text-[32px] mr-2">다시 테스트 해보기</p>
            <img src={restart} alt="다시시작" />
          </Button>
          <img src={share} alt="매칭결과공유" />
          <div className="flex flex-row md:flex-col gap-2 mt-3">
            <button>
              <img src={urlShare} alt="url 공유" />
            </button>
            <button>
              <img src={kakaotalkShare} alt="카카오톡 공유" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
