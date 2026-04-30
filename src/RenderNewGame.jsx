import { normalizeSales } from "./Utils"

export default function RenderNewGame({game, comparison}) {
    // console.log(comparison)
    const baseClassname = "rounded-xl flex flex-col items-center justify-center text-center"
    const setClassname = (color) => {
      switch (color) {
        case 'orange': return 'bg-orange-500 border border-orange-400'
        case 'green': return 'bg-green-600 border border-green-500'
        default: return 'bg-gray-800 border border-gray-600'
      }
    }
    return <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 m-5 ml-5 mr-5">
      
      <div className={`${baseClassname} ${setClassname(comparison.year)}`}>
        <span className="p-3 text-lg font-semibold">
          {game.year}
        </span>
      </div>

      <div className={`${baseClassname} ${setClassname(comparison.genres)}`}>
        <span className="p-3 text-m font-semibold">
            {game.genres.join(', ')}
        </span>
      </div>

      <div className={`${baseClassname} ${setClassname(comparison.platforms)}`}>
        <span className="p-3 text-m font-semibold">
          {game.platforms.join(', ')}
        </span>
      </div>

      <div className={`${baseClassname} ${setClassname(comparison.sales)}`}>
        <span className="p-3 text-lg font-semibold">
          {normalizeSales(game.sales)}
        </span>
      </div>
    </div>
}