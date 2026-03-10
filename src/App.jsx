import { useState, useEffect } from "react";
import { games } from "../__fixtures__/games.js";
import RenderNewGame from "./RenderNewGame.jsx";
import { normalize, win } from "./utils.jsx";
import Tips from "./tips.jsx";
import GiveUpButton from "./GiveUpButton.jsx";


export default function App() {
  const [secretGame, setGame] = useState(null) // загаданная игра
  const [inputText, setInputText] = useState('') // Содержимое ввода в input 
  const [enteredGame, setEnteredGame] = useState(null) // введенная игра (после enter)
  const [statusOfGame, setStatusOfGame] = useState(null) // статус игры
  const [enterGames, setEnterGames] = useState([]) // все введенные игры 
  const [mostMatchingGame, setMostMatchingGame] = useState(null); // самая совпадаемая игра
  
  const choseGame = () => {
      const gameIndex = Math.floor(Math.random() * games.length)
      setGame(games[gameIndex])
    }
  
  useEffect(() => {
    choseGame()
  }, [])

  const renderResult = (status) => {
    switch (status) {
      case 'win':
        win()
        return <h5 className="text-center font-bold text-green-600">Победа!</h5>
      case 'retry':
        return <h5 className="text-center font-bold text-amber-600">Попробуй еще раз!</h5> // возможно поменять текст
      case 'notFound':
        return <h5 className="text-center font-bold text-red-600">Игра не найдена</h5>
      default:
        return null;
    }
  }

  const renderGame = (game) => {
    return enteredGame ? <RenderNewGame game={game} /> : null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isExist = games.find((game) => normalize(game.title) === normalize(inputText))
    
    if (normalize(secretGame.title) === normalize(inputText)) {
      setEnteredGame(secretGame)
      setEnterGames([...enterGames, isExist])
      setMostMatchingGame(secretGame)
      setInputText('')
      setStatusOfGame('win')
    } else if (isExist) {
      setEnteredGame(isExist)
        if (!enterGames.includes(isExist)) {
          setEnterGames([...enterGames, isExist])
          setMostMatchingGame(isExist)
        }
      setInputText('')
      setStatusOfGame('retry')
    }  else {
      setEnteredGame(null)
      setStatusOfGame('notFound')
    }
  }

  if(!secretGame) return null
  console.log(secretGame.title)
  return (<>
    {/* { statusOfGame !== 'win' ? <GiveUpButton /> : null } */}
    <GiveUpButton onConfirm={choseGame} />
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
      <p className="text-gray-300 text-center" >Попробуй угадать игру по подсказкам ниже!</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            minLength={3}
            maxLength={20}
            placeholder="Введите название игры..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={statusOfGame === 'win'}
          />
          {renderResult(statusOfGame)}
          <button
            id="submitButton"
            type="submit"
            className="cursor-pointer mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl"
            disabled={statusOfGame === 'win'}
          >
            Проверить
          </button>
        </form>
    </div>
    <Tips secretGame={secretGame} />
    <br />
    {enterGames.length > 0 ? <div className="mt-5 border-5 border-indigo-500 rounded-xl">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2">Больше всего совпадений:</h3>
        {<RenderNewGame key={enteredGame} game={mostMatchingGame} />}
      </div>
    </div> : null}
    {enterGames.length > 1 ? enterGames.map((game) => game !== mostMatchingGame ? <div className="mt-5 border-3 border-gray-700 rounded-xl"><RenderNewGame key={game} game={game}/> </div> : null) : null}
    </>
  );
}
