import { Link } from "react-router-dom";
import main_img from "../../../assets/images/main_img.png";
import TypingText from "../../../common/TypingText";
//
export default function HeroSection() {
  return (
    <section
      className="bg-[#E3F6FF] mt-6 mb-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 py-12 sm:py-14 rounded-lg relative"
      aria-label="Hero Section"
    >
      <article className="w-full sm:w-auto text-center sm:text-left flex flex-col items-center sm:items-start">
        <div className="w-full">
          <p className="text-[1.375rem] sm:text-[1.625rem] md:text-[1.75rem] font-semibold leading-snug min-h-[3rem] overflow-hidden">
            <TypingText
              text="나에게 맞는 입양동물이 궁금하다면?"
              typingSpeed={50}
            />
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Link
            to="/Matching"
            className="mt-4 group inline-flex items-center min-w-[110px] px-4 py-2 bg-[#09ACFB] text-white rounded-lg hover:bg-point transition-colors"
          >
            <span>찾아보기</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              &gt;
            </span>
          </Link>
        </div>
      </article>
      <figure className="w-full sm:w-[420px] mt-4 sm:mt-0">
        <img src={main_img} alt="Main Image" className="w-full" />
      </figure>
    </section>
  );
}
