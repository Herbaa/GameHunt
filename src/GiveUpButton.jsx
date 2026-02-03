export default function GiveUpButton() { // должна появляться во время начала игры. 
    return (
    <div className="w-full flex justify-end p-4">
                {/* <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Рерол</button>  */} 
        <button className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
            Сдаться
        </button>
    </div>)
}