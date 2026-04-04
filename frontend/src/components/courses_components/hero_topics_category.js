'use client'
import { useState } from "react"

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
            
        </div>
    );
}
