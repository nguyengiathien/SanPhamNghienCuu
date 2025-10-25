import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBox({ placeholder, value, onSubmit }) {
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            onSubmit(value);
        }
    }
    function handleSubmit(event) {
        event.preventDefault();
        onSubmit(value);
    }
    
    return (
        <div className="relative flex-row items-center justify-center inline-block">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onSubmit(e.target.value)}
                className="border bg-white border-indigo-300 rounded-full shadow-md py-2 px-4 w-full xl:max-w-[500px] xl:min-w-[400px] sm:min-w-[300px] sm:max-w-[700px] outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
            <button className="text-sm absolute right-0 top-0 h-full rounded-r-full py-1 px-2 font-medium shadow-2xs hover:bg-indigo-700 hover:shadow-none focus:outline-none cursor-pointer bg-indigo-400" >
                Search
            </button>
        </div>
    );
}
