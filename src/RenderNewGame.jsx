import { normalizeSales } from "./utils"

export default function RenderNewGame({game}) {
    // console.log(game)

    return <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 m-5 ml-5 mr-5">
        {/* <div><h3>{secretGame.title}</h3></div> */}
      
      <div className="rounded-xl bg-gray-800 flex flex-col items-center justify-center text-center">
        <span className="p-3 text-lg font-semibold">
          {game.year}
        </span>
      </div>

      <div className="rounded-xl bg-orange-500 flex flex-col items-center justify-center text-center">
        <span className="p-3 text-m font-semibold">
            {game.genres.join(', ')}
        </span>
      </div>

      <div className="rounded-xl bg-green-600 flex flex-col items-center justify-center text-center">
        <span className="p-3 text-m font-semibold">
          {game.platforms.join(', ')}
        </span>
      </div>

      <div className="rounded-xl bg-gray-800 flex flex-col items-center justify-center text-center">
        <span className="p-3 text-lg font-semibold">
          {normalizeSales(game.sales)}
        </span>
      </div>
    </div>
}