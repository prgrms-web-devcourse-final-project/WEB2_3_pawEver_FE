interface DeleteModalType {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ onCancel, onConfirm }: DeleteModalType) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-md p-6 shadow-lg w-[300px]">
        <p className="text-sm font-medium mb-4">정말 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
