import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function HeroSearchBox() {
    return (
        <div className="relative flex flex-row items-center justify-center">
            <input
                type="text"
                placeholder="Search for topics..."
                className="border bg-gradient-to-r from-white to-indigo-200 border-indigo-300 rounded-full shadow-md py-2 px-4 w-full xl:max-w-[500px] xl:min-w-[400px] sm:min-w-[300px] sm:max-w-[700px] outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            <button className="absolute right-0 top-0 my-[12px] mr-4 hover:text-indigo-700 focus:outline-none cursor-pointer">
                <FontAwesomeIcon icon={faSearch} className="w-[15px] aspect-square"/>
            </button>
        </div>
    );
}
