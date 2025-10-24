"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUsers, faUser, faCog, faChalkboard, faLinesLeaning, faPhone, faClipboardQuestion, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const router = useRouter();


    function Logout() {
        localStorage.clear('user');
        alert('Đăng xuất thành công!');
        setTimeout(() => router.push('/'), 1000)
    }

    return (
        <aside className="z-3 bg-gradient-to-b from-indigo-600 to-violet-800 w-[50px] h-screen shadow-[0_25px_20px_var(--tw-shadow-color,_rgba(0,_0,_0,.5))] fixed">
            <div className="flex items-center justify-center h-16 p-[8px]">
                <h1 className="text-white text-sm font-bold">Logo</h1>
            </div>
            <nav className="p-4 mt-[2rem] relative">
                <ul className="flex flex-col gap-4 absolute left-6 top-0">
                    <li className="group/icon mb-2 left-5 flex flex-row items-center">
                        <FontAwesomeIcon icon={faHouse} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="/provider/" className="text-indigo-800 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Home</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "hidden" : "show"}`}>
                        <FontAwesomeIcon icon={faChalkboard} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#classes" className="text-indigo-700 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Classes</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "hidden" : "show"}`}>
                        <FontAwesomeIcon icon={faLinesLeaning} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="/provider/courses" className="text-indigo-600 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Courses</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && (userData.role === "provider" || userData.role === "student") ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faClipboardQuestion} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#tests" className="text-indigo-500 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Tests</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "provider" ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faBuildingColumns} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#bank" className="text-indigo-400 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Questions Bank</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "hidden" : "show"}`}>
                        <FontAwesomeIcon icon={faPhone} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="/contact" className="text-indigo-300 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm">Contact</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faUsers} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#classes" className="text-indigo-700 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Users Management</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faLinesLeaning} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#lessons" className="text-indigo-600 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Courses Management</a>
                    </li>
                    <li className={`group/icon mb-2  left-5 flex flex-row items-center ${userData !== null && userData && userData.role === "admin" ? "show" : "hidden"}`}>
                        <FontAwesomeIcon icon={faChalkboard} className="mr-2 p-[8px] text-white z-1 bg-indigo-400 rounded-[50%] !w-[22px] !h-[22px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.2)] transition-shadow duration-300" />
                        <a href="#lessons" className="text-indigo-500 hover:text-gray-800 absolute left-3 z-0 py-1 pl-3 pr-2 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:translate-x-5 group-hover/icon:opacity-100 hover:block text-sm text-nowrap">Classes Management</a>
                    </li>
                </ul>
            </nav>
            <div className="group/icon absolute bottom-24 left-[50%] translate-x-[-50%] flex flex-row items-center">
                <FontAwesomeIcon icon={faUser} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] !w-[20px] !h-[20px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
                <div className="flex flex-col gap-2 absolute left-15 bg-white shadow-[0_5px_10px_var(--tw-shadow-color,_rgba(0,_0,_0,.2))] p-2 opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:flex rounded-lg">
                    <a href="#" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm ${userData !== null && userData ? "show" : "hidden"}`}>Profile</a>
                    <a href="#" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm ${userData !== null && userData ? "show" : "hidden"}`} onClick={Logout}>Logout?</a>
                    <a href="/signin" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm ${userData === null || !userData ? "show" : "hidden"}`}>Login?</a>
                    <a href="/signup" className={`text-white text-center shadow-[0_5px_10px_rgba(1,1,1,0.3)] transition-[colors, shadow] duration-300 hover:shadow-none hover:text-gray-800 z-0 font-semibold bg-indigo-500 rounded-sm py-1 px-2 text-sm ${userData === null || !userData ? "show" : "hidden"}`}>Register?</a>
                </div>
            </div>
            <div className="group/icon absolute bottom-10 left-[50%] translate-x-[-50%] flex flex-row items-center">
                <FontAwesomeIcon icon={faCog} className="p-[6px] text-indigo-400 z-1 bg-white rounded-[50%] !w-[20px] !h-[20px] hover:shadow-[0_2px_4px_rgba(1,1,1,0.4)] transition-shadow duration-300" />
                <a href="#settings" className="text-indigo-400 hover:text-gray-800 absolute left-4 z-0 py-1 pl-7 pr-3 rounded-r-full font-semibold bg-white shadow-[0_2px_4px_rgba(1,1,1,0.2)] opacity-0 transition delay-150 duration-300 ease-in-out group-hover/icon:opacity-100 hover:block text-sm">Settings</a>
            </div>
        </aside>
    );
}


