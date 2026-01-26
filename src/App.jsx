import { useState, useEffect } from "react";
import { games } from "../__fixtures__/games.js";
import AddNewGame from "./AddNewGame.jsx";
import confetti from "canvas-confetti";

export default function App() {
  const [secretGame, setGame] = useState(null) // загаданная игра
  const [inputText, setInputText] = useState('') // Содержимое ввода в input 
  const [enteredGame, setEnteredGame] = useState(null) // введеная игра (после enter)
  const [resultOfGame, setResultOfGame] = useState(null) // статус игры

  const normalize = (t) => {
    return (t || "").trim().toLowerCase();
  }

  const win = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 0.6
      }
    });
  };
  // console.log('input - ', inputText)
  // console.log(enteredGame)
  const statusMessage = (status) => {
    switch (status) {
      case 'win':
        win()
        return <h5 className="text-center font-bold text-green-600">Победа!</h5>
      case 'retry':
        return <h5 className="text-center font-bold text-amber-600">Попробуй еще раз!</h5>
      case 'notFound':
        return <h5 className="text-center font-bold text-red-600">Игра не найдена</h5>
      default:
        return null;
    }
  }

  useEffect(() => {
    const gameIndex = Math.floor(Math.random() * games.length)
    setGame(games[gameIndex])
  }, [])

  const renderNewGame = (game) => {
    return enteredGame ? <AddNewGame game={game} /> : null
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    const isExist = games.find((game) => normalize(game.title) === normalize(inputText))
    if (normalize(secretGame.title) === inputText) {
        setEnteredGame(secretGame)
        setInputText('')
        setResultOfGame('win')
    } else if (isExist) {
      setEnteredGame(isExist)
      setInputText('')
      setResultOfGame('retry')
    }  else {
      setEnteredGame(null)
      setResultOfGame('notFound')
    }
  }

  if(!secretGame) return null

  return (<>
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
      <p className="text-gray-300">Попробуй угадать игру по подсказкам ниже!</p>

      <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите название игры..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {statusMessage(resultOfGame)}
          <button
            id="submitButton"
            type="submit"
            className="cursor-pointer mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl"
          >
            Проверить
          </button>
        </form>
    </div>
    
    <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4 mt-10">
      
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
    <br />
    {renderNewGame(enteredGame)}
    </>
  );
}
