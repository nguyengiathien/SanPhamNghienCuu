import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HeroCard({ title, description, icon, color }) {
    return (
        <button className="hero-card bg-indigo-200 p-3 rounded-lg shadow-md flex flex-row items-center justify-evenly space-x-4 hover:shadow-lg transition-shadow duration-300 w-fit">
            <div className="icon-container bg-gradient-to-br from-white to-gray-200 p-3 rounded-full border-indigo-300 border-4">
                <FontAwesomeIcon icon={icon} className={`text-${color}-500 w-[30px] aspect-square`} />
            </div>
            <div className="">
                <h2 className="font-semibold text-gray-800 text-left text-base">{title}</h2>
                <p className="text-gray-600 text-left text-sm">{description}</p>
            </div>
        </button>
    );
}
