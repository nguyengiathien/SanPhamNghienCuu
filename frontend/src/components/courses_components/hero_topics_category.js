'use client'
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

export default function HeroTopicsCategory() {
    const [openedCategory, setOpenedCategory] = useState(0);
    const [chosenTopic, setChosenTopic] = useState(null);
    const [hoveredTopic, setHoveredTopic] = useState(null);

    const topicsCategory = [
        {
            id: 1,
            title: "Web Development",
            topics: [
                { id: 1, title: "HTML" },
                { id: 2, title: "CSS" },
                { id: 3, title: "JavaScript" },
            ]
        },
        {
            id: 2,
            title: "Data Science",
            topics: [
                { id: 1, title: "Python" },
                { id: 2, title: "R" },
                { id: 3, title: "SQL" },
            ]
        },
        {
            id: 3,
            title: "Machine Learning",
            topics: [
                { id: 1, title: "Supervised Learning" },
                { id: 2, title: "Unsupervised Learning" },
                { id: 3, title: "Reinforcement Learning" },
            ]
        },
        {
            id: 4,
            title: "ELearning",
            topics: [
                { id: 1, title: "Online Courses" },
                { id: 2, title: "Virtual Classrooms" },
                { id: 3, title: "Learning Management Systems" },
            ]
        }
    ];



    return (
        <div className="relative flex flex-row items-center justify-center">
            <h2 className="text-sm font-bold mr-4 py-3 text-nowrap">Popular Topics</h2>
            <div className="w-full border border-indigo-300 rounded-lg flex flex-row items-center justify-between shadow-md bg-gradient-to-r from-white to-indigo-200">
                {topicsCategory.map((category) => (
                    <div key={category.id} className="relative after:block after:absolute after:top-1/2 after:right-0 after:translate-y-[-50%] after:w-[1px] after:h-6 after:bg-indigo-300 last:after:hidden" onMouseEnter={() => setHoveredTopic(category.id)} onMouseLeave={() => setHoveredTopic(null)}>
                        <button className={`w-full flex flex-col justify-between items-center px-4 py-3 hover:bg-indigo-300 hover:rounded-md`} onClick={() => setOpenedCategory(openedCategory === category.id ? 0 : category.id)} >
                            <span className="font-medium text-sm">{category.title}</span>
                        </button>
                        {(openedCategory === category.id || hoveredTopic === category.id) && (
                            <div className="py-2 absolute border border-indigo-200 bg-gradient-to-r from-white to-indigo-100 left-0 top-11 shadow-md z-10 inline-block rounded-sm">
                                {category.topics.map((topic) => (
                                    <div key={topic.id} className="cursor-pointer px-4 py-1 hover:bg-indigo-300 w-full text-justify text-nowrap text-xs" onClick={() => setChosenTopic(topic.title)}>
                                        {topic.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
