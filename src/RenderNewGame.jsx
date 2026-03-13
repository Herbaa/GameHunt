import { normalizeSales } from "./utils"

export default function RenderNewGame({game, comparison}) {
    // console.log(comparison)
    const setClassname = (color) => {
      switch (color) {
        case 'gray':
          return "rounded-xl bg-gray-800 flex flex-col items-center justify-center text-center"
        case 'orange':
          return "rounded-xl bg-orange-500 flex flex-col items-center justify-center text-center"
        case 'green':
          return "rounded-xl bg-green-600 flex flex-col items-center justify-center text-center"
        default:
          return null
      }
    }
    return <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 m-5 ml-5 mr-5">
        {/* <div><h3>{secretGame.title}</h3></div> */}
      
      <div className={setClassname(comparison.year)}>
        <span className="p-3 text-lg font-semibold">
          {game.year}
        </span>
      </div>

      <div className={setClassname(comparison.genres)}>
        <span className="p-3 text-m font-semibold">
            {game.genres.join(', ')}
        </span>
      </div>

      <div className={setClassname(comparison.platforms)}>
        <span className="p-3 text-m font-semibold">
          {game.platforms.join(', ')}
        </span>
      </div>

      <div className={setClassname(comparison.sales)}>
        <span className="p-3 text-lg font-semibold">
          {normalizeSales(game.sales)}
        </span>
      </div>
    </div>
}