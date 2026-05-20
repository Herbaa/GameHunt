import {normalizeSales} from '../utils/utils.js'

const tip_keys = ['year', 'genres', 'platforms', 'sales']

export default function Tips({secretGame, difficulty, selectedTips, onSelectTip}) {

  const getValue = (key) => {
    switch (key) {
      case 'year': return secretGame.year
      case 'genres': return secretGame.genres.join(', ')
      case 'platforms': return secretGame.platforms.join(', ')
      case 'sales': return normalizeSales(secretGame.sales)
    }
  }

  const getLabel = (key) => {
    switch (key) {
      case 'year': return 'Год выпуска'
      case 'genres': return 'Жанр'
      case 'platforms': return 'Платформа'
      case 'sales': return 'Кол-во продаж/ скачиваний'
    }
  }

  const isSelected = (key) => {
    if (difficulty === 'easy') return true
    if (difficulty === 'medium') return selectedTips.includes(key)
    if (difficulty === 'hard') return false
  }

  // кликабельно только на ср уровне, если еще не выбран и не набрано 2
  const isClickable = (key) => {
    return difficulty === 'medium' && !selectedTips.includes(key) && selectedTips.length !== 2
  }

  // const setClassname = (color) => {
  //     switch (color) {
  //       case 'orange': return 'bg-orange-500'
  //       case 'green': return 'bg-green-600'
  //       default: return 'bg-gray-800'
  //     }
  //   }

  return (<>
  {selectedTips.length !== 2 && difficulty === 'medium' && <div className="flex flex-col items-center mt-5">
    <span className="font-semibold text-center">Перед началом игры нажмите на две подсказки, которые хотите открыть</span>
  </div>}
  <div id="tips" className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10">
      {tip_keys.map((key) => (
        <div
          key={key}
          onClick={() => isClickable(key) && onSelectTip(key)}
          className={`border border-gray-600 rounded-xl p-4 bg-gray-800 flex flex-col items-center justify-center text-center
            ${isClickable(key) ? 'cursor-pointer hover:bg-gray-600 border-2 border-dashed border-gray-500 transition' : ''}
          `}
        >
          <span className="text-s uppercase tracking-wide text-gray-400 mb-1">
            {getLabel(key)}
          </span>
          <span className="text-lg font-semibold">
            {isSelected(key) ? getValue(key) : '* * *'} 
          </span>
        </div>
      ))}
    </div>
    </>
  )
}