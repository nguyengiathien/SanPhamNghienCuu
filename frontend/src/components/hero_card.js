import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HeroCard({ title, description, icon, color, view }) {
    return (
        <button className={`hero-card bg-indigo-200 py-1 px-2 rounded-lg shadow-md flex flex-row items-center justify-evenly space-x-4 hover:shadow-lg transition-shadow duration-300 w-fit ${view}`}>
            <div className="icon-container bg-gradient-to-br from-white to-gray-200 px-2 py-1 rounded-full border-indigo-300 border-4">
                <FontAwesomeIcon icon={icon} className={`!text-${color}-500 !w-[15px] !h-[15px]`} />
            </div>
            <div className="">
                <h2 className="font-semibold text-gray-800 text-left text-sm">{title}</h2>
                <p className="text-gray-600 text-left text-xs">{description}</p>
            </div>
        </button>
    );
}
