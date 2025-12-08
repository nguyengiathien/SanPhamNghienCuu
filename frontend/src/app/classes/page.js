"use client";
import { useState } from "react";
import Header from "@/components/header";
import ClassCard from "@/components/class_card";

export default function Classes() {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Header />
            <div className="pt-[45px]">
                <div className="tools px-8 py-4 w-full flex flex-row justify-end">
                    <button className="w-[150px] p-2 text-white text-center font-medium text-sm bg-indigo-500 rounded-lg" onClick={() => setShowForm(true)}>Tạo lớp học</button>
                </div>
                <div>
                    <ClassCard classes={{ name: "Lớp học 1" }} />
                </div>
            </div>
            {showForm && (
                <div className="new-class-form relative w-[500px] mx-auto border border-gray-300 rounded-lg p-6 mt-10 mb-10 shadow-lg">
                    <button className="absolute -top-2 -right-2 bg-indigo-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-indigo-300 hover:cursor-pointer" onClick={() => setShowForm(false)}>X</button>
                    <div className="flex flex-row gap-1 items-center">
                        <label className="block text-md font-medium text-gray-700 text-nowrap mr-2">Tên lớp học</label>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button className="mt-4 w-full p-2 text-white text-center font-medium text-sm bg-indigo-500 rounded-lg hover:bg-indigo-600 hover:cursor-pointer">Tạo lớp học</button>
                </div>
            )}
        </>
    );
}