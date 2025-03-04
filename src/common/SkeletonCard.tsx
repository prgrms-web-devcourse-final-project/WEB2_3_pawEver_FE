import "../styles/skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="w-full min-w-[150px] max-w-[320px] bg-gray-200 rounded-lg shadow-md flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      {/* AnimalCard의 이미지 영역은 16:9(aspect-video)와 rounded-t-lg */}
      <div className="w-full aspect-video bg-gray-300 rounded-t-lg animate-pulse"></div>
      <div className="p-3 sm:p-4 flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="relative flex gap-2 mt-3">
          <div className="bg-gray-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs animate-pulse w-16"></div>
          <div className="bg-gray-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs animate-pulse w-10"></div>
          <div className="absolute bottom-1 right-0 w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
