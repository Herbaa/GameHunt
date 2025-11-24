export default function LoseButton() { // будет появляться вовремя начала игры. 
    return (
    <div class="w-full flex justify-end p-4">
        <button class="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
            Сдаться
        </button>
    </div>
    )
}