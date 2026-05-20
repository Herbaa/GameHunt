export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description }) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-black font-bold mb-4 text-center">{title}</h2>
        <p className="mb-6 text-black text-center">{description}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Закрыть
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="cursor-pointer flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}