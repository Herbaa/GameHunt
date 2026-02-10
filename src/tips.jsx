import { normalizeSales } from "./utils"

export default function Tips({secretGame}) {

  return <div id="tips" className=" max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10">
    
  <div className="rounded-xl p-4 bg-gray-800 flex flex-col items-center justify-center text-center">
    <span className="text-s uppercase tracking-wide text-gray-400 mb-1">
      Год выпуска
    </span>
    <span className="text-lg font-semibold">
      {secretGame.year}
    </span>
  </div>

  <div className="rounded-xl p-4 bg-orange-500 flex flex-col items-center justify-center text-center">
    <span className="text-s uppercase opacity-80 mb-1">
      Жанр
    </span>
    <span className="text-m font-semibold line-clamp-2">
      {secretGame.genres.join(', ')}
    </span>
  </div>

  <div className="rounded-xl p-4 bg-green-600 flex flex-col items-center justify-center text-center">
    <span className="text-s uppercase opacity-80 mb-1">
      Платформа
    </span>
    <span className="text-m font-semibold line-clamp-2">
      {secretGame.platforms.join(', ')}
    </span>
  </div>

  <div className="rounded-xl p-4 bg-gray-800 flex flex-col items-center justify-center text-center">
    <span className="text-sm uppercase tracking-wide text-gray-400 mb-1">
      Продажи
    </span>
    <span className="text-lg font-semibold">
      {normalizeSales(secretGame.sales)}
    </span>
  </div>

  </div>
}