'use client'
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"

export default function HeroTopicsCategory() {
    const [openedCategory, setOpenedCategory] = useState(0);
    const [chosenTopic, setChosenTopic] = useState(null);

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
        <div className="relative">
            <h2 className="text-base font-bold mr-2 py-3">Popular Topics</h2>
            <div className={`text-justify px-3  list-none p-2 bg-white shadow-md mb-4 absolute top-[2px] left-32 z-1 w-[180px] cursor-pointer border border-gray-300 outline-none after:content-['▼'] after:${openedCategory ? 'rotate-180' : ''} rounded-full ${openedCategory ? 'h-auto' : 'h-12 overflow-hidden'}`} onClick={() => setOpenedCategory(!openedCategory)}>
                <div className="cursor-pointer w-max p-[2px] rounded-full hover:bg-gray-300">All Topics</div>
                {topicsCategory.map((topic) => (
                    <div key={topic.id} className="cursor-pointer w-max p-[2px] rounded-full hover:bg-gray-300">
                        {topic.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
