import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import RenderNewGame from "./RenderNewGame.jsx";
import { compareGames, normalize, win, calcScore } from "./utils.jsx";
import Tips from "./tips.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import InfoIcon from "./assets/info.svg?react"
import InfoDialog from "./InfoDialog.jsx";
import WinDialog from "./WinDialog.jsx";

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
    return JSON.parse(raw)
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

  // загаданная игра
  const [secretGame, setSecretGame] = useState(null)
  const [inputText, setInputText] = useState("") // текст в инпуте
  const [statusOfGame, setStatusOfGame] = useState(null) // статус игры
  const [enterGames, setEnterGames] = useState([]) // все введенные игры
  const [difficulty, setDifficulty] = useState('easy') // сложность игры
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [games, setGames] = useState([]) // все игры из бд
  const [isLoading, setIsLoading] = useState(true) // загрузка игр из бд
  const [isFocused, setIsFocused] = useState(false) // фокус на инпуте
  const [chosenDifficulty, setChosenDifficulty] = useState(null)// сложность, которую хочет выбрать юзер

  const [selectedTips, setSelectedTips] = useState([]) // какие подсказки открыл пользователь (ср уровень)

  useEffect(() => { // загрузка игр из supabase
    const fetchGames = async () => {
      const {data, error} = await supabase.from('games').select('*')
      if (error) {
        console.error('Ошибка загрузки игр: ', error);
        return
      }
      setGames(data)
      setIsLoading(false)
    }
    fetchGames()
  }, [])

  const [isRestored, setIsRestored] = useState(false) // восстановлено ли состояние
  
  useEffect(() => { // восстановление состояния из localstorage
    if (games.length === 0 || isRestored) return

    const saved = loadState()
    if (saved) {
      const secretGame = games.find((game) => game.id === saved.secretGameId)

      if (secretGame) {
        setSecretGame(secretGame)

        const enterGames = (saved.enterGameIds ?? []).map((id) => {
          const game = games.find((gm) => gm.id === id)
          if (!game) return null
          const comparison = compareGames(game, secretGame)
          const score = calcScore(comparison)
          return {game, comparison, score}
        })
        .filter(Boolean)

        setEnterGames(enterGames)
        setStatusOfGame(saved.statusOfGame ?? null)
        setDifficulty(saved.difficulty ?? 'easy')
        setSelectedTips(saved.selectedTips ?? [])
      }
    } else { // если нет сохраненного состояние 
      setSecretGame(games[Math.floor(Math.random() * games.length)])
    }
    setIsRestored(true)
  }, [games])

  useEffect(() => {
    if (secretGame && isRestored) {
      saveState(secretGame, enterGames, statusOfGame, difficulty, selectedTips)
    }
  }, [secretGame, enterGames, statusOfGame, difficulty, selectedTips])

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
    setSecretGame(games[Math.floor(Math.random() * games.length)])
    setInputText("")
    setStatusOfGame(null)
    setEnterGames([])
    setSelectedTips([])
  }

  const handleDifficulty = (key) => {
    if (key === difficulty) return
    if (enterGames.length > 0) {
      setChosenDifficulty(key)
    } else {
      setDifficulty(key)
      choseGame()
    }
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
    const isExist = games.find((game) => {
      return normalize(game.title) === normalize(inputText) ||
      (game.aliases ?? []).some((alias) => normalize(alias) === normalize(inputText))
    })
      
    if (!isExist) {
      setStatusOfGame('notFound')
      return
    }
    const isSecretGame = normalize(secretGame.title) === normalize(inputText) ||
      (secretGame.aliases ?? []).some((alias) => normalize(alias) === normalize(inputText))
    
    if (isSecretGame) {
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

  const inputListGames = isFocused && inputText.trim().length > 0 ? games.filter((game) => { // выпадающий список 
    return normalize(game.title).includes(normalize(inputText)) ||
    (game.aliases ?? []).some((alias) => normalize(alias).includes(normalize(inputText)))
  }).slice(0, 5) : []
  
  if (isLoading || !isRestored) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      Загрузка...
    </div>
  ) 

  return (    
    <>

     <div className="relative flex flex-wrap justify-center gap-3 items-center pt-4 px-4">
        {enterGames.length > 0 && (
          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="md:absolute md:left-4 cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
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
        className="md:absolute md:right-4 cursor-pointer text-gray-400 hover:text-white transition"
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
    
    <ConfirmDialog
      isOpen={chosenDifficulty !== null}
      onClose={() => setChosenDifficulty(null)}
      onConfirm={() => {
        setDifficulty(chosenDifficulty)
        choseGame()
        setChosenDifficulty(null)
      }}
      title="Сменить сложность?"
      description="Текущий прогресс не сохранится"
    />

    <WinDialog 
      isOpen={statusOfGame === 'win'}
      onConfirm={choseGame}
      enterGames={enterGames}
      secretGame={secretGame}
      difficulty={difficulty}
    />
      
      <div className="flex flex-col items-center gap-4 mt-10">
        <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
        <p className="text-gray-300 text-center">Попробуй угадать игру по подсказкам ниже!</p>

        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
          <div className="relative">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            minLength={3}
            maxLength={40}
            placeholder="Введите название игры..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={statusOfGame === "win" || isInputBlocked}
          />

          {inputListGames.length > 0 && (
            <ul className="animate-fadeIn absolute z-100 w-full mt-1 bg-gray-800 border border-gray-700  rounded-xl overflow-hidden">
            {inputListGames.map((game) => (
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition"
                key={game.id}
                onMouseDown={() => {
                  setInputText(game.title)
                  setIsFocused(false)
                }}>
                {game.title}
              </li>
            ))}
          </ul>
        )}
      </div>
          {renderResult(statusOfGame)}
          <button
            type="submit"
            className="cursor-pointer mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition"
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
        <div className="animate-fadeIn mt-5 border-5 border-indigo-500 rounded-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">Больше всего совпадений:</h3>
            <h5 className="text-lg font-semibold mt-2">{mostMatchingGame.game.title}</h5>
            <RenderNewGame game={mostMatchingGame.game} comparison={mostMatchingGame.comparison}/>
          </div>
        </div>
      )}

      {sortedOtherGames.map((entry) => (
        <div key={entry.game.id} className="animate-fadeIn mt-5 border-3 border-gray-700 rounded-xl">
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