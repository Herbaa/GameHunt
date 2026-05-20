const STORAGE_KEY = 'gamehunt_state'

export const saveState = (secretGame, enterGames, statusOfGame, difficulty, selectedTips) => {
  try {
    const state = {
      secretGameId: secretGame.id,
      enterGameIds: enterGames.map((entry) => entry.game.id),
      statusOfGame,
      difficulty,
      selectedTips
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error(e)
  }
}

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearState = () => localStorage.removeItem(STORAGE_KEY)