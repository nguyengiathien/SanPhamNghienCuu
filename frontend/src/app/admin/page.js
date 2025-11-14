'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from '@/components/footer';
import ChartTest from '@/components/admin/home_components/chart_test';
import DashboardChart from '@/components/admin/home_components/chart_dashboard_test';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faUser, faUserPlus, faLinesLeaning, faChalkboard, faAngleRight, faCog, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import { Container } from 'postcss';

export default function Home() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();

  function Logout() {
    localStorage.clear('user');
    alert('Đăng xuất thành công!');
    setTimeout(() => router.push('/'), 1000)
  }

  return (
    <>
      <div id="container" className=" min-h-screen">
        <aside className="bg-white w-[250px] h-screen z-3 fixed border-r-2 border-indigo-300 px-2 shadow-md">
          <div className='w-full text-center py-8 text-xl font-bold text-indigo-600'>Logo</div>
          <nav className='px-2'>
            <li className={`group/icon mb-2 py-2 flex flex-row items-center hover:cursor-pointer`}>
              <FontAwesomeIcon icon={faHome} className="mr-2 p-[8px] text-gray-800 z-1 !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="/admin/" className="text-gray-800 z-0 py-1 px-1 w-full font-semibold bg-white transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Trang chủ</a>
            </li>
            <li className={`group/icon mb-2 py-2 flex flex-row items-center hover:cursor-pointer`}>
              <FontAwesomeIcon icon={faUsers} className="mr-2 p-[8px] text-gray-800 z-1 !w-[20px]  transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="#classes" className="text-gray-800 z-0 py-1 px-1 w-full font-semibold bg-white transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Quản lý người dùng</a>
            </li>
            <li className={`group/icon mb-2 py-2 flex flex-row items-center hover:cursor-pointer`}>
              <FontAwesomeIcon icon={faLinesLeaning} className="mr-2 p-[8px] text-gray-800 z-1 !w-[20px]  transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="#lessons" className="text-gray-800 z-0 py-1 px-1 w-full font-semibold bg-white transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Quản lý khóa học</a>
            </li>
            <li className={`group/icon mb-2 py-2 flex flex-row items-center hover:cursor-pointer`}>
              <FontAwesomeIcon icon={faChalkboard} className="mr-2 p-[8px] text-gray-800 z-1 !w-[20px]  transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="#lessons" className="text-gray-800 z-0 py-1 px-1 w-full font-semibold bg-white transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Quản lý lớp học</a>
            </li>
          </nav>
          <div className="w-full px-4 list-none absolute bottom-20 left-[50%] translate-x-[-50%] flex flex-col items-center justify-between gap-2">
            <div className={`group/icon w-full flex flex-row items-center ${userData !== null && userData ? "show" : "hidden"}`}>
              <FontAwesomeIcon icon={faUser} className="p-[8px] text-gray-800 z-1  !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="/profile" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Thông tin cá nhân</a>
            </div>
            <div className={`group/icon w-full flex flex-row items-center ${userData !== null && userData ? "show" : "hidden"}`}>
              <FontAwesomeIcon icon={faRightFromBracket} className="p-[8px] text-gray-800 z-1 !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="#" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500" onClick={Logout}>Đăng xuất</a>
            </div>
            <div className={`group/icon w-full flex flex-row items-center ${userData === null || !userData ? "show" : "hidden"}`}>
              <FontAwesomeIcon icon={faRightToBracket} className="p-[8px] text-gray-800 z-1 !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="/signin" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Đăng nhập</a>
            </div>
            <div className={`group/icon w-full flex flex-row items-center ${userData === null || !userData ? "show" : "hidden"}`}>
              <FontAwesomeIcon icon={faUserPlus} className="p-[8px] text-gray-800 z-1 !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
              <a href="/signup" className="w-full p-1 text-gray-800 font-semibold transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Đăng ký</a>
            </div>
          </div>
          <div className="group/icon w-full px-4 absolute bottom-10 left-[50%] translate-x-[-50%] flex flex-row items-center">
            <FontAwesomeIcon icon={faCog} className="p-[8px] text-gray-800 z-1 !w-[20px] transition-shadow duration-200 group-hover/icon:text-indigo-500" />
            <a href="#settings" className="w-full p-1 text-gray-800 font-semibold bg-white transition duration-200 ease-in-out text-sm text-nowrap group-hover/icon:text-indigo-500">Cài đặt</a>
          </div>
        </aside>

        <main className="bg-white z-2 ml-[250px]">
          <div className="font-bold text-2xl text-red-700 py-6 px-4 text-shadow-2xs">
            <FontAwesomeIcon icon={faAngleRight} />
            Quản lý hệ thống
          </div>
          <ChartTest />
          <DashboardChart />
          <Footer />
        </main>
      </div>
    </>
  );
}