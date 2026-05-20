export default function GameStatus({ status }) {
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
}