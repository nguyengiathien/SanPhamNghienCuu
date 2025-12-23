"use client"

import { useEffect, useState } from 'react'

export default function LessonPage() {
    const sampleSections = [
        { id: 'lesson1', title: 'Bài học 1: Giới thiệu', content: 'Nội dung bài học 1...' },
        { id: 'lesson2', title: 'Bài học 2: Cơ bản', content: 'Nội dung bài học 2...' },
        { id: 'lesson3', title: 'Bài học 3: Nâng cao', content: 'Nội dung bài học 3...' },
        { id: 'lesson4', title: 'Bài học 4: Thực hành', content: 'Nội dung bài học 4...' },
        { id: 'lesson5', title: 'Bài học 5: Tổng kết', content: 'Nội dung bài học 5...' }
    ]

    const [sections, setSections] = useState(sampleSections)
    const [currentIndex, setCurrentIndex] = useState(0)

    // loadSections: cố gắng fetch từ endpoint, nếu lỗi thì dùng sample
    async function loadSections() {
        try {
            const res = await fetch('/api/sections')
            if (!res.ok) throw new Error('Network response not ok')
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setSections(data)
                setCurrentIndex(0)
            } else {
                setSections(sampleSections)
            }
        } catch (err) {
            setSections(sampleSections)
        }
    }

    useEffect(() => {
        loadSections()
    }, [])

    function goNext() {
        setCurrentIndex((i) => Math.min(i + 1, sections.length - 1))
    }

    function goPrev() {
        setCurrentIndex((i) => Math.max(i - 1, 0))
    }

    return (
        <>
            <aside className="w-[250px] h-full py-4 bg-white border-r border-gray-200 fixed">
                <nav>
                    <h2 className="px-4 text-xl font-bold my-3">Danh sách bài học</h2>
                    <ul className="space-y-2 overflow-auto h-[calc(100vh-100px)]">
                        {sections.map((s, idx) => (
                            <li key={s.id} className={`border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-200 `}>
                                <button onClick={() => setCurrentIndex(idx)} className={`w-full px-8 py-4 text-left ${currentIndex === idx ? 'bg-gray-200 font-semibold' : ''} hover:cursor-pointer`}>{s.title}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="ml-[250px] p-6">
                {sections[currentIndex] && (
                    <section id={sections[currentIndex].id} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{sections[currentIndex].title}</h2>
                        <p className="text-gray-700">{sections[currentIndex].content}</p>

                        <div className="mt-6 w-full flex items-center justify-between">
                            {currentIndex > 0 ? (
                                <button onClick={goPrev} className="px-4 py-2 bg-indigo-200 hover:bg-indigo-400 hover:cursor-pointer rounded">Prev</button>
                            ) : (
                                <div />
                            )}

                            {currentIndex < sections.length - 1 ? (
                                <button onClick={goNext} className="px-4 py-2 bg-indigo-200 hover:bg-indigo-400 hover:cursor-pointer rounded">Next</button>
                            ) : (
                                <div />
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>

    )
}