import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faCog, faChalkboard, faLinesLeaning, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    return (
        <aside className="z-3 bg-gradient-to-b from-indigo-600 to-violet-800 w-[50px] h-screen shadow-[0_25px_20px_var(--tw-shadow-color,_rgba(0,_0,_0,.5))] fixed">
            <div className="flex items-center justify-center h-16 p-[8px]">
                <h1 className="text-white text-sm font-bold">Logo</h1>
            </div>
            <nav className="p-4 mt-[2rem] relative">
                <ul>
                    <li className="group/icon mb-2 absolute top-0 left-5 flex flex-row items-center">
                        <FontAwesomeIcon icon={faHouse} className="mr-2 p-[8px] text-white z-1 bg-indigo-800 rounded-[50%] aspect-square w-[40px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#home" className="text-indigo-800 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Home</a>
                    </li>
                    <li className="group/icon mb-2 absolute top-17 left-5 flex flex-row items-center">
                        <FontAwesomeIcon icon={faChalkboard} className="mr-2 p-[8px] text-white z-1 bg-indigo-700 rounded-[50%] aspect-square w-[40px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#classes" className="text-indigo-700 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Classes</a>
                    </li>
                    <li className="group/icon mb-2 absolute top-34 left-5 flex flex-row items-center">
                        <FontAwesomeIcon icon={faLinesLeaning} className="mr-2 p-[8px] text-white z-1 bg-indigo-600 rounded-[50%] aspect-square w-[40px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="/courses" className="text-indigo-600 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Courses</a>
                    </li>
                    <li className="group/icon mb-2 absolute top-51 left-5 flex flex-row items-center">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 p-[8px] text-white z-1 bg-indigo-500 rounded-[50%] aspect-square w-[40px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#contact" className="text-indigo-500 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Contact</a>
                    </li>
                </ul>
            </nav>
            <div className="group/icon absolute bottom-24 left-[50%] translate-x-[-50%] flex flex-row items-center">
                <FontAwesomeIcon icon={faUser} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] aspect-square w-[35px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
                <div className="flex flex-col gap-2 absolute left-15 bg-white shadow-[0_5px_10px_var(--tw-shadow-color,_rgba(0,_0,_0,.2))] p-2 opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:flex rounded-lg">
                    <a href="#profile" className="text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2">Login?</a>
                    <a href="/signup" className="text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2">Register?</a>
                </div>
            </div>
            <div className="group/icon absolute bottom-10 left-[50%] translate-x-[-50%] flex flex-row items-center">
                <FontAwesomeIcon icon={faCog} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] aspect-square w-[35px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
                <a href="#settings" className="text-indigo-400 hover:text-gray-800 absolute left-4 z-0 py-2 pl-7 pr-3 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:block text-sm">Settings</a>
            </div>
        </aside>
    );
}


