import confetti from "canvas-confetti";

export const normalize = (t) => {
  return (t || "").trim().toLowerCase();
}

export const win = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      y: 0.6
    }
  });
};

export const normalizeSales = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(0) + ' млрд.'
  if (num >= 1000000) return (num / 1000000).toFixed(0) + ' млн.'
  if (num >= 1000) return (num / 1000).toFixed(0) + ' тыс.'
}

export const compareGames = (entered, secret) => {
  let year = ''
  let genres = ''
  let platforms = ''
  let sales = ''

  const yearDiff = Math.abs(secret.year - entered.year)
  if (yearDiff === 0) year = 'green'
  else if (yearDiff <= 3) year = 'orange'
  else year = 'gray'

  // общие жанры
  const commonGenres = entered.genres.filter((genre) => secret.genres.includes(genre)) 
  if (commonGenres.length === secret.genres.length) genres = 'green'
  else if (commonGenres.length > 0) genres = 'orange'
  else genres = 'gray'

  const commonPlatforms = entered.platforms.filter((platform) => secret.platforms.includes(platform))
  if (commonPlatforms.length === secret.platforms.length) platforms = 'green'
  else if (commonPlatforms.length > 0) platforms = 'orange'
  else platforms = 'gray'

  const salesDiff = Math.abs(secret.sales - entered.sales) / secret.sales
  if (entered.sales === secret.sales) sales = 'green'
  else if (salesDiff <= 0.25) sales = 'orange'
  else sales = 'gray'

  return {year, genres, platforms, sales}
}

export const calcScore = (comparison) => {
  const colorPoints = {gray: 0, orange: 1, green: 2}
  return Object.values(comparison).reduce((sum, color) => sum + colorPoints[color], 0)
}

export const renderResult = (status) => {
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

export const hideSecretGame = (secretGame) => {
  const chars = Array.from(secretGame)
  const filteredChars = chars.map((char, i) => char !== ' ' ? i : null)
    .filter((i) => i !== null)

  const countOfChars = Math.max(1, Math.round(filteredChars.length / 5)) // кол-во открытых букв

  const mixed = [...filteredChars].sort(() => Math.random() - 0.5)
  const indOfChar = new Set(mixed.slice(0, countOfChars)) // индексы открытых букв

  return chars.map((char, i) => {
    if (char === ' ') return ' '
    if (indOfChar.has(i)) return char
    return '*'
  })
  .join('')
}
// export const colorRank = {gray: 0, orange: 1, green: 2}

// export const mergeTipColors = (prevColors, newComparison) => {  // сравнение текущего obj с цветами подсказок и нового obj из mostMatchingGame
//   const newColors = { ...prevColors }
//   for (const key in newComparison) {
//     if (colorRank[newComparison[key]] > colorRank[prevColors[key]]) {
//       newColors[key] = newComparison[key]
//     }
//   }
//   return newColors
// }
