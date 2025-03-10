export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-main rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-500">Loading...</span>
    </div>
  );
}
