"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faUserPlus, faChalkboard, faLinesLeaning, faPhone, faClipboardQuestion, faBuildingColumns, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const router = useRouter();

    function Logout() {
        localStorage.clear('user');
        alert('Đăng xuất thành công!');
        setTimeout(() => router.push('/'), 1000)
    }

    return (
        <header className="fixed w-full z-2 bg-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
            <div className="max-w-[1200px] m-auto flex flex-row justify-between">
                <div className="left-site flex flex-row">
                    <h1 className="text-indigo-500 text-lg font-bold p-2 w-fit">Logo</h1>
                    <nav className="flex flex-row justify-evenly items-center gap-12 w-fit ml-12">
                        <li className="group/icon left-5 flex flex-row items-center">
                            {/* <FontAwesomeIcon icon={faHouse} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="/" className="text-gray-800 z-0 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3">Trang chủ</a>
                        </li>
                        <li className={`group/icon left-5 flex flex-row items-center`}>
                            {/* <FontAwesomeIcon icon={faChalkboard} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="/classes" className="text-gray-800 z-0 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3">Lớp học</a>
                        </li>
                        <li className={`group/icon left-5 flex flex-row items-center`}>
                            {/* <FontAwesomeIcon icon={faLinesLeaning} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="/courses" className="text-gray-800 z-0 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3">Khóa học</a>
                        </li>
                        <li className={`group/icon left-5 flex flex-row items-center ${userData !== null && userData !== undefined && (userData.role === "provider" || userData.role === "student") ? "show" : "hidden"}`}>
                            {/* <FontAwesomeIcon icon={faClipboardQuestion} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="#tests" className="text-gray-800 z-0 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3">Đề thi</a>
                        </li>
                        <li className={`group/icon left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "provider" ? "show" : "hidden"}`}>
                            {/* <FontAwesomeIcon icon={faBuildingColumns} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="#bank" className="text-gray-800 z-0 font-semibold transition duration-200 group-hover/icon:text-indigo-500 ease-in-out text-sm text-nowrap py-3">Ngân hàng câu hỏi</a>
                        </li>
                        <li className={`group/icon left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "admin" ? "hidden" : "show"}`}>
                            {/* <FontAwesomeIcon icon={faPhone} className="p-3 text-gray-800 z-1 !w-[20px] transition duration-200 group-hover/icon:text-indigo-500" /> */}
                            <a href="/contact" className="text-gray-800 z-0 font-semibold transition duration-200 ease-in-out text-sm text-nowrap py-3 group-hover/icon:text-indigo-500">Liên hệ</a>
                        </li>
                    </nav>
                </div>
                <div className="right-site flex flex-row gap-1">
                    <div className={`group/icon w-full flex flex-row items-center ${userData !== null && userData ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faUser} className="p-[8px] text-gray-800 z-1  !w-[15px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
                        <a href="/profile" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Thông tin cá nhân</a>
                    </div>
                    <div className={`group/icon w-full flex flex-row items-center ${userData !== null && userData ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="p-[8px] text-gray-800 z-1 !w-[15px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
                        <a href="#" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500" onClick={Logout}>Đăng xuất</a>
                    </div>
                    <div className={`group/icon w-full flex flex-row items-center ${userData === null || !userData ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faRightToBracket} className="p-[8px] text-gray-800 z-1 !w-[15px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
                        <a href="/signin" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Đăng nhập</a>
                    </div>
                    <div className={`group/icon w-full flex flex-row items-center ${userData === null || !userData ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faUserPlus} className="p-[8px] text-gray-800 z-1 !w-[15px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
                        <a href="/signup" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Đăng ký</a>
                    </div>
                </div>
            </div>
        </header>
        // <aside className="z-3 bg-gradient-to-b from-indigo-600 to-violet-800 w-[50px] h-screen shadow-[0_25px_20px_var(--tw-shadow-color,_rgba(0,_0,_0,.5))] fixed">
        //     <div className="flex items-center justify-center h-16 p-[8px]">
        //         <h1 className="text-white text-sm font-bold">Logo</h1>
        //     </div>
        //     <nav className="p-4 mt-[2rem] relative">
        //         <ul className="flex flex-col gap-4 absolute left-2 top-0">
        //             <li className="group/icon mb-2 left-5 flex flex-row items-center">
        //                 <FontAwesomeIcon icon={faHouse} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href={`${userData !== undefined && userData !== null && userData.role === "admin" ? "/admin" : "/"}`} className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Trang chủ</a>
        //             </li>
        //             <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "admin" ? "hidden" : "show"}`}>
        //                 <FontAwesomeIcon icon={faChalkboard} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href="#classes" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Lớp học</a>
        //             </li>
        //             <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "admin" ? "hidden" : "show"}`}>
        //                 <FontAwesomeIcon icon={faLinesLeaning} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href="/courses" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Khóa học</a>
        //             </li>
        //             <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData !== undefined && (userData.role === "provider" || userData.role === "student") ? "show" : "hidden"}`}>
        //                 <FontAwesomeIcon icon={faClipboardQuestion} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href="#tests" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Đề thi</a>
        //             </li>
        //             <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "provider" ? "show" : "hidden"}`}>
        //                 <FontAwesomeIcon icon={faBuildingColumns} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href="#bank" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap text-nowrap">Ngân hàng câu hỏi</a>
        //             </li>
        //             <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData !== undefined && userData.role === "admin" ? "hidden" : "show"}`}>
        //                 <FontAwesomeIcon icon={faPhone} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
        //                 <a href="/contact" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Liên hệ</a>
        //             </li>
        //         </ul>
        //     </nav>
        //     <div className="group/icon absolute bottom-24 left-[50%] translate-x-[-50%] flex flex-row items-center">
        //         <FontAwesomeIcon icon={faUser} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] !w-[20px] !h-[20px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
        //         <div className="flex flex-col gap-2 absolute left-15 bg-white shadow-[0_5px_10px_var(--tw-shadow-color,_rgba(0,_0,_0,.2))] p-2 opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:flex rounded-lg">
        //             <a href="/profile" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm text-nowrap ${userData !== null && userData ? "show" : "hidden"}`}>Thông tin cá nhân</a>
        //             <a href="#" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm text-nowrap ${userData !== null && userData ? "show" : "hidden"}`} onClick={Logout}>Đăng xuất</a>
        //             <a href="/signin" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm text-nowrap ${userData === null || !userData ? "show" : "hidden"}`}>Đăng nhập</a>
        //             <a href="/signup" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm text-nowrap ${userData === null || !userData ? "show" : "hidden"}`}>Đăng ký</a>
        //         </div>
        //     </div>
        //     <div className="group/icon absolute bottom-10 left-[50%] translate-x-[-50%] flex flex-row items-center">
        //         <FontAwesomeIcon icon={faCog} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] !w-[20px] !h-[20px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
        //         <a href="#settings" className="text-indigo-400 hover:text-gray-800 absolute left-4 z-0 py-1 pl-7 pr-3 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Cài đặt</a>
        //     </div>
        // </aside>
    );
}


