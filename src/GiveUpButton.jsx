import { useState } from "react";

export default function GiveUpButton({ onConfirm }) {
  const [isDialogOpen, setIsDialogOpen] = useState(null)
  return (
  <div className="w-full flex justify-end p-4">
    {/* <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Рерол</button>  */} 
    <button 
    onClick={() => setIsDialogOpen(true)} 
    className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
      Сдаться 
    </button>
  {isDialogOpen && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    onClick={() => setIsDialogOpen(false)}
  >
    <div
      className="bg-white p-6 rounded-xl shadow-xl  max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl text-black font-bold mb-4 text-center">
        Сдаться?
      </h2>

      <p className="mb-6 text-black text-center">
        Вы уверены, что хотите сбросить игру?
      </p>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => setIsDialogOpen(false)}
          className="cursor-pointer flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
        >
          Закрыть
        </button>

        <button
          className="cursor-pointer flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          onClick={() => {
            setIsDialogOpen(false)
            onConfirm()
          }}
        >
          Сдаться
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};