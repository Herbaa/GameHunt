export default function Tips({secretGame}) {

  return <div id="tips" className="max-w-3xl mx-auto grid grid-cols-4 gap-4 mt-10">
    
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Год выпуска</h3>
      <div className="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
        {secretGame.year}
      </div>
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Жанр игры</h3>
      <div className="w-full p-4 rounded-xl bg-orange-500 text-white text-center flex items-center justify-center">
        {secretGame.genres.join(', ')}
      </div>
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Платформа</h3>
      <div className="w-full p-4 rounded-xl bg-green-600 text-white text-center flex items-center justify-center">
        {secretGame.platforms.join(', ')}
      </div>
    </div>

    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Продажи</h3>
      <div className="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
        {secretGame.sales}
      </div>
    </div>
  </div>
}