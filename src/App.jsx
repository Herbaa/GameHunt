import { useState, useEffect } from "react";
import { games } from "../__fixtures__/games.js";
import RenderNewGame from "./RenderNewGame.jsx";
import { normalize, win } from "./utils.jsx";
import Tips from "./tips.jsx";
import GiveUpButton from "./GiveUpButton.jsx";

const STORAGE_KEY = "gamehunt_state";

const saveState = (secretGame, enterGames, statusOfGame) => {
  try {
    const state = {
      secretGameId: secretGame.id,
      enterGameIds: enterGames.map((game) => game.id),
      statusOfGame
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { secretGameId, enterGameIds, statusOfGame } = JSON.parse(raw)

    const secretGame = games.find((game) => game.id === secretGameId)
    if (!secretGame) return null

    const enterGames = enterGameIds
      .map((id) => games.find((game) => game.id === id))
      .filter(Boolean)

    return { secretGame, enterGames, statusOfGame }
  } catch {
    return null
  }
};

const clearState = () => localStorage.removeItem(STORAGE_KEY)

export default function App() {
  const saved = loadState() // состояние из localstorage

  // загаданная игра
  const [secretGame, setGame] = useState(saved?.secretGame ?? (() => games[Math.floor(Math.random() * games.length)]))
  const [inputText, setInputText] = useState("") // текст в инпуте
  const [statusOfGame, setStatusOfGame] = useState(saved?.statusOfGame ?? null) // статус игры
  const [enterGames, setEnterGames] = useState(saved?.enterGames ?? []) // все введенные игры

  const mostMatchingGame = enterGames.length > 0 ? enterGames[enterGames.length - 1] : null // самая совпадаемая игра

  useEffect(() => {
    if (secretGame) {
      saveState(secretGame, enterGames, statusOfGame);
    }
  }, [secretGame, enterGames, statusOfGame]);

  const choseGame = () => {
    clearState()
    const gameIndex = Math.floor(Math.random() * games.length)
    setGame(games[gameIndex])
    setInputText("")
    setStatusOfGame(null)
    setEnterGames([])
  }

  const renderResult = (status) => {
    switch (status) {
      case "win":
        return <h5 className="text-center font-bold text-green-600">Победа!</h5>
      case "retry":
        return <h5 className="text-center font-bold text-amber-600">Попробуй еще раз!</h5>
      case "notFound":
        return <h5 className="text-center font-bold text-red-600">Игра не найдена</h5>
      default:
        return null
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isExist = games.find((game) => normalize(game.title) === normalize(inputText));

    if (!isExist) {
      setStatusOfGame('notFound')
      return
    }

    if (normalize(secretGame.title) === normalize(inputText)) {
      win()
      setEnterGames((prev) => [...prev, secretGame])
      setInputText("")
      setStatusOfGame("win")
    } else {
      if (!enterGames.find((game) => game.id === isExist.id)) {
        setEnterGames((prev) => [...prev, isExist])
      }
      setInputText("")
      setStatusOfGame("retry")
    }
  };

  if (!secretGame) return null;

  return (
    <>
      <GiveUpButton onConfirm={choseGame} />
      <div className="flex flex-col items-center gap-4 mt-10">
        <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
        <p className="text-gray-300 text-center">Попробуй угадать игру по подсказкам ниже!</p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            minLength={3}
            maxLength={40}
            placeholder="Введите название игры..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={statusOfGame === "win"}
          />
          {renderResult(statusOfGame)}
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl"
            disabled={statusOfGame === "win"}
          >
            Проверить
          </button>
        </form>
      </div>

      <Tips secretGame={secretGame} />
      <br />

      {mostMatchingGame && (
        <div className="mt-5 border-5 border-indigo-500 rounded-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Больше всего совпадений:</h3>
            <RenderNewGame game={mostMatchingGame} />
          </div>
        </div>
      )}

      {enterGames.length > 1 &&
        enterGames.filter((game) => game.id !== mostMatchingGame?.id)
          .map((game) => (
            <div key={game.id} className="mt-5 border-3 border-gray-700 rounded-xl">
              <RenderNewGame game={game} />
            </div>
          ))}
    </>
  );
}