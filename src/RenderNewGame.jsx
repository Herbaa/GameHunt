export default function RenderNewGame({game}) {
    // console.log(game)

    return <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4 m-5 ml-5 mr-5">
        {/* <div><h3>{secretGame.title}</h3></div> */}
      
      <div className="flex flex-col items-center">
        <div className="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
          {game.year}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full p-4 rounded-xl bg-orange-500 text-white text-center flex items-center justify-center">
            {game.genres.join(', ')}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full p-4 rounded-xl bg-green-600 text-white text-center flex items-center justify-center">
          {game.platforms.join(', ')}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full p-4 rounded-xl bg-gray-800 text-center flex items-center justify-center">
          {game.sales}
        </div>
      </div>
    </div>
}