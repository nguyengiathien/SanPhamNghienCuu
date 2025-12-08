import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faSquarePhone, faBook } from "@fortawesome/free-solid-svg-icons";

export default function CurrentClassesCard({ classes }) {
    return (
        <div className="course-item border border-emerald-200 bg-emerald-700 rounded-lg p-3 shadow-xs hover:shadow-md transition-shadow duration-200 w-[250px] h-[120px] mx-auto relative">
            <h3 className="absolute bottom-0 left-0 font-semibold text-lg text-white py-3 px-4 hover:underline hover:decoration-solid hover:cursor-pointer">{classes.name}</h3>
            <div className="absolute top-0 right-0">
                <div className="relative w-[40px] h-[40px] group/icon">
                    <FontAwesomeIcon icon={faEllipsis} className="text-white !w-[20px] absolute py-3 pr-3 top-0 right-0 transition hover:cursor-pointer" />
                    <div className="bg-emerald-600 shadow-lg shadow-gray-600 absolute top-6 right-1 text-white text-xs text-nowrap list-none border-none rounded-sm hidden z-10 group-hover/icon:block">
                        <li className="mb-1 py-1 px-2.5 hover:bg-emerald-800 cursor-pointer rounded-t-sm"><span>Ẩn lớp học</span></li>
                        <li className="mb-1 py-1 px-2.5 hover:bg-emerald-800 cursor-pointer"><span>Rời khỏi lớp học</span></li>
                        <li className="mb-1 py-1 px-2.5 hover:bg-emerald-800 cursor-pointer"><span>Quản lý nhóm</span></li>
                        <li className="mb-1 py-1 px-2.5 hover:bg-emerald-800 cursor-pointer"><span>Thêm thành viên</span></li>
                        <li className="py-1 px-2.5 hover:bg-emerald-800 cursor-pointer rounded-b-sm"><span>Link tham gia</span></li>
                    </div>
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