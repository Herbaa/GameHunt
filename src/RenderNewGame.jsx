import { normalizeSales } from "./Utils"

export default function RenderNewGame({game, comparison}) {
    // console.log(comparison)
    const baseClassname = "rounded-xl flex flex-col items-center justify-center text-center"
    const setClassname = (color) => {
      switch (color) {
        case 'orange': return 'bg-orange-500'
        case 'green': return 'bg-green-600'
        default: return 'bg-gray-800'
      }
    }
    return <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 m-5 ml-5 mr-5">
        {/* <div><h3>{secretGame.title}</h3></div> */}
      
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