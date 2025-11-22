import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faSquarePhone, faBook } from "@fortawesome/free-solid-svg-icons";

export default function CurrentClassesCard({ classes }) {
    return (
        <div className="course-item border border-emerald-200 bg-emerald-700 rounded-lg p-3 shadow-xs hover:shadow-md transition-shadow duration-200 w-[250px] h-[120px] mx-auto relative">
            <h3 className="absolute bottom-0 left-0 font-semibold text-lg text-white py-3 px-4">{classes.name}</h3>
            <div className="relative group/icon">
                <FontAwesomeIcon icon={faEllipsis} className="text-white !w-[20px] absolute top-0 right-0 transition hover:cursor-pointer" />
                <div className="bg-white border border-gray-400 shadow-2xs absolute top-0 -right-10">
                    <li>
                        <span>Ẩn lớp học</span>
                    </li>
                    <li>
                        
                    </li>
                </div>
            </div>
            <div className="text-white flex flex-row gap-2 absolute top-0 left-0">
                <div className="relative group/icon">
                    <FontAwesomeIcon icon={faSquarePhone} className="text-white !w-[20px] py-3 pl-3 transition hover:cursor-pointer" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-nowrap text-gray-600 hidden group-hover/icon:block">Gọi điện</span>
                </div>
                <div className="relative group/icon">
                    <FontAwesomeIcon icon={faBook} className="text-white !w-[20px] py-3 pr-3 transition hover:cursor-pointer" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-nowrap text-gray-600 hidden group-hover/icon:block">Bài tập</span>
                </div>
            </div>
        </div>
    );
} 