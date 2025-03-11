import Lottie from "lottie-react";
import loadingpaw from "../assets/images/loadingPaw.json";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Lottie
        animationData={loadingpaw}
        loop={true}
        className="w-[100px] h-[100px] mb-4"
      />
    </div>
  );
}
