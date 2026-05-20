import { useState, useEffect } from "react";
import { fetchGames } from "../api/games.js";
import { compareGames, normalize, win, calcScore, hideSecretGame } from "../utils/utils.js";
import { saveState, loadState, clearState } from "../utils/storage.js";
export const useGame = () => {
 
 // загаданная игра
  const [secretGame, setSecretGame] = useState(null)
  const [statusOfGame, setStatusOfGame] = useState(null) // статус игры
  const [enterGames, setEnterGames] = useState([]) // все введенные игры
  const [difficulty, setDifficulty] = useState('easy') // сложность игры
  const [isRestored, setIsRestored] = useState(false) // восстановлено ли состояние

  const [isHintOpen, setIsHintOpen] = useState(false)
  const [hint, setHint] = useState(null)

  const [games, setGames] = useState([]) // все игры из бд
  const [isLoading, setIsLoading] = useState(true) // загрузка игр из бд
  const [chosenDifficulty, setChosenDifficulty] = useState(null)// сложность, которую хочет выбрать юзер

  const [selectedTips, setSelectedTips] = useState([]) // какие подсказки открыл пользователь (ср уровень)

  useEffect(() => { // загрузка игр из supabase
    fetchGames()
    .then((data) => {
      setGames(data)
      setIsLoading(false)
    })
    .catch((e) => console.error(e))
  }, [])
  
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
        setIsHintOpen(saved.isHintOpen ?? false)
        setHint(saved.hint ?? null)
      }
    } else { // если нет сохраненного состояние 
      setSecretGame(games[Math.floor(Math.random() * games.length)])
    }
    setIsRestored(true)
  }, [games])

  useEffect(() => {
    if (secretGame && isRestored) {
      saveState(secretGame, enterGames, statusOfGame, difficulty, selectedTips, hint, isHintOpen)
    }
  }, [secretGame, enterGames, statusOfGame, difficulty, selectedTips, hint, isHintOpen])

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
    setStatusOfGame(null)
    setEnterGames([])
    setSelectedTips([])
    setHint(null)
    setIsHintOpen(false)
    // console.log(secretGame)
  }

  const handleOpenHint = () => {
    setHint(hideSecretGame(secretGame.title))
    setIsHintOpen(true)
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

const handleSubmit = (e, inputText, setInputText) => {
    e.preventDefault()
    const isExist = games.find((game) =>{
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
      setEnterGames((prev) => [...prev, { game: isExist, comparison, score }])
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
  }

  return {
    games, secretGame, enterGames, statusOfGame, difficulty,
    selectedTips, hint, isHintOpen, chosenDifficulty, isLoading,
    isRestored, mostMatchingGame, sortedOtherGames,

    choseGame, handleSubmit, handleDifficulty, handleSelectTip, 
    handleOpenHint, setChosenDifficulty, setDifficulty
  }
  
}