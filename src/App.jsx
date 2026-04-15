import { useState, useEffect } from "react";
import { games } from "../__fixtures__/games.js";
import RenderNewGame from "./RenderNewGame.jsx";
import { compareGames, normalize, win, calcScore } from "./utils.jsx";
import Tips from "./tips.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import InfoIcon from "./assets/info.svg?react"
import InfoDialog from "./InfoDialog.jsx";

const STORAGE_KEY = "gamehunt_state";

const saveState = (secretGame, enterGames, statusOfGame, difficulty, selectedTips) => {
  try {
    const state = {
      secretGameId: secretGame.id,
      enterGameIds: enterGames.map((entry) => entry.game.id),
      statusOfGame,
      difficulty,
      selectedTips 
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { secretGameId, enterGameIds, statusOfGame, difficulty, selectedTips } = JSON.parse(raw)

    const secretGame = games.find((game) => game.id === secretGameId)
    if (!secretGame) return null

    const enterGames = enterGameIds
      .map((id) => {
        const game = games.find((game) => game.id === id)
        if (!game) return null
        const comparison = compareGames(game, secretGame)
        const score = calcScore(comparison)
        return { game, comparison, score }
      })
      .filter(Boolean)

    return { secretGame, enterGames, statusOfGame, difficulty, selectedTips: selectedTips ?? [] }
  } catch {
    return null
  }
};

const difficulties = [
  { key: 'easy', label: 'Легкая', activeClass: 'bg-green-600 hover:bg-green-700', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
  { key: 'medium', label: 'Средняя', activeClass: 'bg-orange-500 hover:bg-orange-600', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
  { key: 'hard', label: 'Сложная', activeClass: 'bg-red-500 hover:bg-red-600', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
]

const clearState = () => localStorage.removeItem(STORAGE_KEY)

// -------------------------------------------------------------------------------------------------------------------------

export default function App() {
  const [saved] = useState(() => loadState()) // состояние из localstorage

  // загаданная игра
  const [secretGame, setGame] = useState(saved?.secretGame ?? (() => games[Math.floor(Math.random() * games.length)]))
  const [inputText, setInputText] = useState("") // текст в инпуте
  const [statusOfGame, setStatusOfGame] = useState(saved?.statusOfGame ?? null) // статус игры
  const [enterGames, setEnterGames] = useState(saved?.enterGames ?? []) // все введенные игры
  const [difficulty, setDifficulty] = useState(saved?.difficulty ?? 'easy') // сложность игры
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const [selectedTips, setSelectedTips] = useState(saved?.selectedTips ?? []) // какие подсказки открыл пользователь (ср уровень)

  useEffect(() => {
    if (secretGame) {
      saveState(secretGame, enterGames, statusOfGame, difficulty, selectedTips);
    }
    // console.log(`Game: ${enterGames[enterGames.length - 1]?.game.title}\nScore: ${enterGames[enterGames.length - 1]?.score}`)
  }, [secretGame, enterGames, statusOfGame, difficulty, selectedTips]);

  const isInputBlocked = difficulty === 'medium' && selectedTips.length !== 2

  const mostMatchingGame = enterGames.length > 0
 ? enterGames.reduce((best, entry) => entry.score > best.score ? entry : best)
  : null // самая совпадающая игра

  // сортировка по убыванию score на странице
  const sortedOtherGames = enterGames
    .filter((entry) => entry.game.id !== mostMatchingGame?.game.id)
    .sort((a, b) => b.score - a.score);

  const choseGame = () => {
    clearState()
    const gameIndex = Math.floor(Math.random() * games.length)
    setGame(games[gameIndex])
    setInputText("")
    setStatusOfGame(null)
    setEnterGames([])
    setSelectedTips([])
  }

  const handleDifficulty = (key) => {
    if (key === difficulty) return
    setDifficulty(key)
    choseGame()
  }

  const handleSelectTip = (tipKey) => {
    if(selectedTips.length === 2) return
    if (selectedTips.includes(tipKey)) return
    return setSelectedTips((prev) => [...prev, tipKey])
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
      const comparison = compareGames(isExist, secretGame)
      const score = calcScore(comparison)
      setEnterGames((prev) => [...prev, {game: isExist, comparison, score}])
      setInputText("")
      setStatusOfGame("win")
    } else {
      const alreadyEntered = enterGames.find((entry) => entry.game.id === isExist.id)
      if (!alreadyEntered) {
        const comparison = compareGames(isExist, secretGame)
        const score = calcScore(comparison)
        setEnterGames((prev) => [...prev, {game: isExist, comparison, score}])
      }
      setInputText("")
      setStatusOfGame("retry")
    }
  };
  
  if (!secretGame) return null;
  return (    
    <>

     <div className="relative flex justify-center items-center pt-4 px-4">
        {enterGames.length > 0 && (
          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="absolute left-4 cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Сброс игры
          </button>
        )}


      <div className="flex gap-3">
        {difficulties.map(({ key, label, activeClass, inactiveClass }) => (
          <button
            key={key}
            onClick={() => handleDifficulty(key)}
            className={`cursor-pointer font-bold py-2 px-4 rounded-lg text-white transition ${difficulty === key ? activeClass : inactiveClass}`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setIsInfoOpen(true)}
        className="absolute right-4 cursor-pointer text-gray-400 hover:text-white transition"
      >
      <InfoIcon width={32} height={32} />
    </button>

    </div>
    <ConfirmDialog
      isOpen={isResetDialogOpen}
      onClose={() => setIsResetDialogOpen(false)}
      onConfirm={choseGame}
      title="Сбросить игру?"
      description="Вы уверены, что хотите закончить игру?"
    />
      
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
            disabled={statusOfGame === "win" || isInputBlocked}
          />
          {renderResult(statusOfGame)}
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl"
            disabled={statusOfGame === "win" || isInputBlocked}
          >
            Проверить
          </button>
        </form>
      </div>

      <Tips 
        secretGame={secretGame} 
        difficulty={difficulty} 
        selectedTips={selectedTips} 
        onSelectTip={handleSelectTip}/>
      <br /> 

      {mostMatchingGame?.game && (
        <div className="mt-5 border-5 border-indigo-500 rounded-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Больше всего совпадений:</h3>
            <h5 className="text-lg font-semibold mt-2">{mostMatchingGame.game.title}</h5>
            <RenderNewGame game={mostMatchingGame.game} comparison={mostMatchingGame.comparison}/>
          </div>
        </div>
      )}

      {sortedOtherGames.map((entry) => (
        <div key={entry.game.id} className="mt-5 border-3 border-gray-700 rounded-xl">
          <div className="flex flex-col items-center">
            <h5 className="text-lg font-semibold mt-2">{entry.game.title}</h5>
          <RenderNewGame game={entry.game} comparison={entry.comparison}/>
        </div>
        </div>
      ))}
      <InfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}