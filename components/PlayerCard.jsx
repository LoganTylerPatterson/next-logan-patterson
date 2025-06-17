
export default function PlayerCard() {
    return (
        <div className="w-100 flex space-between">
            <img
                className="w-90 aspect-[2/3]"
                src="/PlayerCard.png"
                alt="Image of Logan Patterson as an action figure with golf clubs, a laptop, and an energy drink"
            />
            <div className="">
                <h2>Hi, I am Logan Patterson</h2>
                <p>Software Engineer | Father | Husband | Tinkerer</p>
            </div>
        </div>
    )
}