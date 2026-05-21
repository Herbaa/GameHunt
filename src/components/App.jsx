import { useState } from "react";
import RenderNewGame from "./RenderNewGame.jsx";
import GameStatus from "./GameStatus.jsx";
import Tips from "./Tips.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import InfoIcon from "../assets/info.svg?react"
import HintIcon from "../assets/hint.svg?react"
import InfoDialog from "./InfoDialog.jsx";
import WinDialog from "./WinDialog.jsx";
import LoseDialog from "./LoseDialog.jsx";
import { normalize } from "../utils/utils.js";
import { useGame } from "../hooks/useGame.js";

const difficulties = [
  { key: 'easy', label: 'Легкая', activeClass: 'bg-green-600 hover:bg-green-700', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
  { key: 'medium', label: 'Средняя', activeClass: 'bg-orange-500 hover:bg-orange-600', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
  { key: 'hard', label: 'Сложная', activeClass: 'bg-red-500 hover:bg-red-600', inactiveClass: 'bg-gray-700 hover:bg-gray-600' },
]

// -------------------------------------------------------------------------------------------------------------------------

export default function App() {
  const {
    games, secretGame, enterGames, statusOfGame, difficulty,
    selectedTips, hint, isHintOpen, chosenDifficulty, isLoading,
    isRestored, mostMatchingGame, sortedOtherGames,

    choseGame, handleSubmit, handleDifficulty, handleSelectTip,
    handleOpenHint, setChosenDifficulty, setDifficulty
  } = useGame()

  const [isHintConfirmOpen, setIsHintConfirmOpen] = useState(false)
  const [isLoseDialogOpen, setIsLoseDialogOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false) // фокус на инпуте
  const [inputText, setInputText] = useState("") // текст в инпуте

  const isInputBlocked = difficulty === 'medium' && selectedTips.length !== 2

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
            className="md:absolute md:left-4 cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Сброс игры
          </button>
        )}

      <div className="flex gap-3">
        {difficulties.map(({ key, label, activeClass, inactiveClass }) => (
          <button
            key={key}
            onClick={() => handleDifficulty(key)}
            className={`cursor-pointer font-bold py-2 px-4 rounded-lg text-white transition ${difficulty === key ? activeClass : inactiveClass}`}>
            {label}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setIsInfoOpen(true)}
        className="md:absolute md:right-4 cursor-pointer">
        <InfoIcon width={28} height={28} />
      </button>
    </div>

    <ConfirmDialog
      isOpen={isResetDialogOpen}
      onClose={() => setIsResetDialogOpen(false)}
      onConfirm={() => {
        setIsResetDialogOpen(false)
        setIsLoseDialogOpen(true)
      }}
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

    <ConfirmDialog
      isOpen={isHintConfirmOpen}
      onClose={() => setIsHintConfirmOpen(false)}
      onConfirm={() => {
        setIsHintConfirmOpen(false)
        handleOpenHint()
      }}
      title="Открыть подсказку?"
      description="Будет показано зашифрованное название игры"
    />

    <WinDialog 
      isOpen={statusOfGame === 'win'}
      onConfirm={choseGame}
      enterGames={enterGames}
      secretGame={secretGame}
      difficulty={difficulty}
    />

    <LoseDialog
      isOpen={isLoseDialogOpen}
      onConfirm={() => {
        setIsLoseDialogOpen(false)
        choseGame()
      }}
      enterGames={enterGames}
      secretGame={secretGame}
      difficulty={difficulty}
    />
      
      <div className="flex flex-col items-center gap-4 mt-10">
        <h1 className="text-4xl font-bold text-indigo-400">GameHunt</h1>
        <p className="text-gray-300 text-center">Попробуй угадать игру по подсказкам ниже!</p>

        <form onSubmit={(e) => handleSubmit(e, inputText, setInputText)} className="w-full max-w-md mt-6">
          <div className="relative">
            {isHintOpen && hint && (
              <div className="w-full text-center mb-3 px-2">
                <p className="text-2xl font-mono font-bold tracking-[0.3em] text-indigo-300">
                  {hint}
                </p>
              </div>
            )}
            <div className="flex">
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
              {enterGames.length > 8 && !isHintOpen &&
                <button
                  onClick={() => setIsHintConfirmOpen(true)}
                  className="ml-2 cursor-pointer">
                  <HintIcon width={32} height={32}/>
                </button>
              }
              
            </div>
            {inputListGames.length > 0 && (
              <ul className="animate-fadeIn absolute z-100 w-full mt-1 bg-gray-800 border border-gray-700  rounded-xl overflow-hidden">
              {inputListGames.map((game) => (
                <li className="px-4 py-2 flex justify-between cursor-pointer hover:bg-gray-700 transition"
                  key={game.id}
                  onMouseDown={() => {
                    setInputText(game.title)
                    setIsFocused(false)
                  }}>
                  <span>{game.title}</span>
                  {enterGames.find((gm) => gm.game.title === game.title) && <span>✅</span>}
                </li>
              ))}
            </ul>
            )}
          </div>
          <GameStatus status={statusOfGame} />
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
  <div className="animate-fadeIn mt-5 bg-gray-800/50 border-5 border-indigo-500 rounded-xl">
    <div className="flex flex-col items-center pt-4">
      <span className="text-xs uppercase tracking-wide text-gray-400 mb-1">Больше всего совпадений</span>
      <h3 className="text-xl font-bold text-white">{mostMatchingGame.game.title}</h3>
      <div className="w-16 h-1 bg-indigo-500 rounded-full mt-2" />
    </div>
    <RenderNewGame game={mostMatchingGame.game} comparison={mostMatchingGame.comparison} />
  </div>
)}

{sortedOtherGames.map((entry) => (
  <div key={entry.game.id} className="animate-fadeIn mt-5 border-3 border-gray-700 rounded-xl">
    <div className="flex flex-col items-center pt-4">
      <h3 className="text-lg font-semibold text-gray-300">{entry.game.title}</h3>
      <div className="w-10 h-1 bg-gray-600 rounded-full mt-2" />
    </div>
    <RenderNewGame game={entry.game} comparison={entry.comparison} />
  </div>
))}
      <InfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}
