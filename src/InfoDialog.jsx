export default function InfoDialog({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" 
        onClick={onClose}/>

      <div className="fixed top-0 right-0 h-full w-100 max-w-[50%] bg-gray-900 border-l border-gray-700 z-50 flex flex-col">
    
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-indigo-400">GameHunt</h2>
          <button
            className="cursor-pointer text-gray-400 hover:text-white transition text-2xl leading-none"
            onClick={onClose}>
            Х
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">

          <section>
            <h3 className="text-lg font-semibold mb-2">Что такое GameHunt?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GameHunt - игра на угадывание видеоигр по подсказкам. 
              Вводи названия игр и следи за тем, насколько они совпадают с загаданной.
            </p>
          </section>   

          <section>
            <h3 className="text-lg font-semibold mb-2">Как играть?</h3>
            <ul className="text-gray-400 text-sm leading-relaxed flex flex-col gap-2">
              <li>1. Введи название любой видеоигры в поле ввода</li>
              <li>2. Подсказки подсветятся в зависимости от совпадения</li>
              <li>3. Угадай загаданную игру как можно быстрее</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Цвета подсказок</h3>     
            <div className="flex flex-col gap-2"> 
              <div className="flex items-center gap-3"> 
                <div className="w-4 h-4 rounded bg-gray-600 shrink-0" />
                <span className="text-gray-400 text-sm">Нет совпадений</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-orange-500 shrink-0" />
                <span className="text-gray-400 text-sm">Частичное совпадение</span>
              </div>  
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-600 shrink-0" />
                <span className="text-gray-400 text-sm">Полное совпадение</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Сложности</h3>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-green-500 font-semibold text-sm">Лёгкая</span>
                <p className="text-gray-400 text-sm mt-1">Все 4 подсказки открыты сразу</p>
              </div>
              <div>
                <span className="text-orange-500 font-semibold text-sm">Средняя</span>
                <p className="text-gray-400 text-sm mt-1">Перед игрой надо выбрать 2 подсказки из 4, остальные будут скрыты</p>
              </div>
              <div>
                <span className="text-red-500 font-semibold text-sm">Сложная</span>
                <p className="text-gray-400 text-sm mt-1">Все подсказки скрыты</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}