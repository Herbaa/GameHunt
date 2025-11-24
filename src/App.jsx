export default function App() {
  return (<>
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
      <p className="text-gray-300">Попробуй угадать игру по подсказкам ниже!</p>

      <input
        id="game-input"
        type="text"
        placeholder="Введите название игры..."
        className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button className="cursor-pointer px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition">
        Проверить
      </button>
    </div>
    {/* Тестовый блок с подсказками */}
    <div class="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mt-10">
      
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-2">Год выпуска</h3>
        <div class="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
          1111
        </div>
      </div>

      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-2">Жанр игры</h3>
        <div class="w-full p-4 rounded-xl bg-orange-500 text-white text-center flex items-center justify-center">
          Песочница, шутер, пиксельная
        </div>
      </div>

      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-2">Платформа</h3>
        <div class="w-full p-4 rounded-xl bg-green-600 text-white text-center flex items-center justify-center">
          Windows, Nintendo Switch, Android
        </div>
      </div>

      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-2">Кол-во продаж</h3>
        <div class="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
          60 млн
        </div>
      </div>
    </div>
    
    </>
  );
}
