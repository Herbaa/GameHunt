export default function LoseDialog({isOpen, onConfirm, enterGames, secretGame, difficulty}) {
  if (!isOpen) return null
  
  const difficultyLabel = {
    easy: { label: 'Легкая', className: 'text-green-500' },
    medium: { label: 'Средняя', className: 'text-orange-500' },
    hard: { label: 'Сложная', className: 'text-red-500' }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="animate-popIn bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-white">Вы сдались!</h2>
          <p className="text-gray-400 text-sm">Не получилось угадать игру</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Загаданная игра</span>
          <span className="text-white text-xl font-bold">{secretGame.title}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Попыток</span>
            <span className="text-white text-2xl font-bold">{enterGames.length}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-1">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Сложность</span>
            <span className={`text-2xl font-bold ${difficultyLabel[difficulty].className}`}>
              {difficultyLabel[difficulty].label}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="cursor-pointer flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition">
            Новая игра
          </button>
        </div>
        
      </div>
    </div>
  )
}