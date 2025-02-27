import "../css/skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="min-w-[256px] w-full max-w-[256px] bg-gray-200 rounded-xl shadow-md flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>

      <div className="w-full aspect-[16/9] bg-gray-300 rounded-t-xl animate-pulse"></div>

      <div className="px-3 py-2 flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>

        <div className="relative flex gap-2 mt-2">
          <div className="bg-gray-300 p-2 rounded w-16 h-5 animate-pulse"></div>
          <div className="bg-gray-300 p-2 rounded w-10 h-5 animate-pulse"></div>
          <div className="absolute bottom-1 right-0 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
