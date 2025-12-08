'use client';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import AAssignmentCard from "@/components/class/assignment/assignment_card";
import GAssignmentCard from "@/components/class/general/assignment_card";

export default function Class() {
    const classInfo = {
        name: "Lớp học mẫu",
        description: "Đây là mô tả của lớp học mẫu.",
    };

    const [activeSection, setActiveSection] = useState('general');
    const [assignmentTags, setAssignmentTags] = useState('all');

    return (
        <>
            <aside className="bg-indigo-800 w-[250px] h-screen z-3 fixed border-r-2 border-indigo-300 px-2 shadow-md p-4">
                <h2 className="text-white text-2xl text-justify font-bold m-auto px-4 py-2">{classInfo.name}</h2>
                <hr className="border-indigo-300 my-2"></hr>
                <nav className="text-white text-sm text-justify font-normal flex flex-col gap-4 px-8 py-4 list-none">
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'general' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('general')}
                    >
                        <a>Chung</a>
                    </li>
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'assignments' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('assignments')}
                    >
                        <a>Bài tập</a>
                    </li>
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'sources' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('sources')}
                    >
                        <a>Tài liệu</a>
                    </li>
                </nav>
            </aside>

            <main className="ml-[250px] p-6">
                {activeSection === 'general' && (
                    <section id="general-section" className="mb-8">
                        <header className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold text-indigo-950 mb-4">Chung</h3>
                            <div>
                                <button className="p-2 text-indigo-700 text-center text-sm hover:cursor-pointer"><FontAwesomeIcon icon={faVideo} className="!w-[20px] !h-[20px] " /></button>
                                <button className="p-2 text-indigo-700 text-center text-sm hover:cursor-pointer"><FontAwesomeIcon icon={faCircleExclamation} className="!w-[20px] !h-[20px] " /></button>
                            </div>
                        </header>
                        <hr className="border-indigo-950"></hr>
                        <div className="mt-4 text-indigo-900">
                            <GAssignmentCard assignment={{ title: "Bài tập 1", description: "Mô tả bài tập 1", dueDate: "2024-07-01" }} />
                            <GAssignmentCard assignment={{ title: "Bài tập 2", description: "Mô tả bài tập 2", dueDate: "2024-07-05" }} />
                        </div>
                    </section>
                )}

                {activeSection === 'assignments' && (
                    <section id="assignments-section" className="mb-8">
                        <header className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold text-indigo-950 mb-4">Bài tập</h3>
                        </header>
                        <hr className="border-indigo-950"></hr>
                        <div className="flex flex-row gap-2 my-3">
                            <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'all' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'all' ? 'text-black' : 'text-gray-500'}`} onClick={() => {setAssignmentTags('all')}}>Tất cả</a>
                            <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'incomplete' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'incomplete' ? 'text-black' : 'text-gray-500'}`} onClick={() => {setAssignmentTags('incomplete')}}>Chưa hoàn thành</a>
                            <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'complete' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'complete' ? 'text-black' : 'text-gray-500'}`} onClick={() => {setAssignmentTags('complete')}}>Đã hoàn thành</a>
                            <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'overdue' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'overdue' ? 'text-black' : 'text-gray-500'}`} onClick={() => {setAssignmentTags('overdue')}}>Quá hạn</a>
                        </div>
                        <div className="mt-4 text-indigo-900">
                            <AssignmentCard assignment={{ title: "Bài tập 1", description: "Mô tả bài tập 1", dueDate: "2027-07-01", isSubmitted: false }} />
                            <AssignmentCard assignment={{ title: "Bài tập 2", description: "Mô tả bài tập 2", dueDate: "2024-07-05", isSubmitted: true }} />
                        </div>
                    </section>
                )}

                {activeSection === 'sources' && (
                    <section id="sources-section" className="mb-8">
                        <h3 className="text-2xl font-bold text-indigo-950 mb-4">Tài liệu</h3>
                        <p className="text-indigo-900">Danh sách tài liệu sẽ được hiển thị ở đây.</p>
                    </section>
                )}
            </main>
        </>
    );
}