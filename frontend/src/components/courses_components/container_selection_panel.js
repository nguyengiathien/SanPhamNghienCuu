"use client";
import { useState } from "react";
import ContainerSelectionExpandedBox from "./container_selection_expanded_box";

export default function ContainerSelectionPanel() {
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
                { id: 4, title: "Python" },
                { id: 5, title: "R" },
                { id: 6, title: "SQL" },
            ]
        },
        {
            id: 3,
            title: "Machine Learning",
            topics: [
                { id: 7, title: "Supervised Learning" },
                { id: 8, title: "Unsupervised Learning" },
                { id: 9, title: "Reinforcement Learning" },
            ]
        },
        {
            id: 4,
            title: "ELearning",
            topics: [
                { id: 10, title: "Online Courses" },
                { id: 11, title: "Virtual Classrooms" },
                { id: 12, title: "Learning Management Systems" },
            ]
        }
    ];
    const languages = [
        { id: 1, title: "English" },
        { id: 2, title: "Spanish" },
        { id: 3, title: "French" },
        { id: 4, title: "German" },
        { id: 5, title: "Chinese" },
        { id: 6, title: "Japanese" },
        { id: 7, title: "Korean" },
        { id: 8, title: "Russian" },
        { id: 9, title: "Portuguese" },
        { id: 10, title: "Italian" },
        { id: 11, title: "Arabic" },
        { id: 12, title: "Hindi" },
        { id: 13, title: "Bengali" },
        { id: 14, title: "Punjabi" },
        { id: 15, title: "Javanese" },
        { id: 16, title: "Vietnamese" },
    ];
    const costs = [
        { id: 1, title: "Free" },
        { id: 2, title: "From 0 to 100", min: 0, max: 100 },
        { id: 3, title: "From 100 to 500", min: 100, max: 500 },
        { id: 4, title: "From 500 to 1,000", min: 500, max: 1000 },
        { id: 5, title: "Above 1,000", min: 1000, max: null },
    ];
    const durations = [
        { id: 1, title: "Less than 2 hours" },
        { id: 2, title: "2 to 10 hours" },
        { id: 3, title: "10 hours to 1 day" },
        { id: 4, title: "1 to 3 days" },
        { id: 5, title: "3 days to 1 week" },
        { id: 6, title: "1 week to 3 weeks" },
        { id: 7, title: "More than 3 weeks" },
    ];

    const topics = [];
    topicsCategory.forEach(category => {
        category.topics.forEach(topic => {
            topics.push(topic);
        });
    });

    const [expandedVisible, setExpandedVisible] = useState(false);

    function handleMoreClick() {
        setExpandedVisible(true);
    }

    function handleCloseExpanded() {
        setExpandedVisible(false);
    }

    return (
        <div className="container-selection-panel inline-block align-top border-r border-gray-300 pr-6">
            {/* Content for Container Selection Panel goes here */}
            <div className="container-selection-panel-topics mb-4 after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
                {/* Content for Container Selection Panel Topics goes here */}
                <h3 className="font-bold leading-normal text-base mb-2">Topics</h3>
                <ul>
                    {topicsCategory.map((category, index) => (
                        index <= 5 && (
                            <li key={category.id} className="mb-2">
                                <h4 className="font-medium text-sm leading-normal">{category.title}</h4>
                                <ul>
                                    {category.topics.map(topic => (
                                        <li key={topic.id} className="text-xs leading-normal flex items-center gap-1">
                                            <input type="checkbox" /> {topic.title}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )))}
                </ul>
                <div className="mt-1">
                    <button className="text-xs font-semibold leading-normal underline cursor-pointer hover:text-blue-500" onClick={handleMoreClick}>More</button>
                </div>
                <ContainerSelectionExpandedBox children={topics} visible={expandedVisible} onClose={handleCloseExpanded} />
            </div>
            <div className="container-selection-panel-costs after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
                {/* Content for Container Selection Panel Costs goes here */}
                <h3 className="font-bold leading-normal text-base mb-2">Costs</h3>
                <ul>
                    {costs.map((cost) => (
                        <li key={cost.id} className="text-xs leading-normal flex items-center gap-1">
                            <input type="checkbox" /> {cost.title}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="container-selection-panel-duration after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
                {/* Content for Container Selection Panel Duration goes here */}
                <h3 className="font-bold leading-normal text-base mb-2">Duration</h3>
                <ul>
                    {durations.map((duration, index) => (
                        index < 5 && (
                            <li key={duration.id} className="text-xs leading-normal flex items-center gap-1">
                                <input type="checkbox" /> {duration.title}
                            </li>
                        )))}
                </ul>
                <div className="mt-1">
                    <button className="text-xs font-semibold leading-normal underline cursor-pointer hover:text-blue-500" onClick={handleMoreClick}>More</button>
                </div>
                <ContainerSelectionExpandedBox children={durations} visible={expandedVisible} onClose={handleCloseExpanded} />
            </div>  
            <div className="container-selection-panel-topics after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
                {/* Content for Container Selection Panel Topics goes here */}
                <h3 className="font-bold leading-normal text-base mb-2">Languages</h3>
                <ul>
                    {languages.map((language, index) => (
                        index < 5 && (
                            <li key={language.id} className="text-xs leading-normal flex items-center gap-1">
                                <input type="checkbox" /> {language.title}
                            </li>
                        )))}
                </ul>
                <div className="mt-1">
                    <button id="moreBtn" className="text-xs font-semibold leading-normal underline cursor-pointer hover:text-blue-500" onClick={handleMoreClick}>More</button>
                </div>

                {/* Expanded modal box - controlled by state */}
                <ContainerSelectionExpandedBox children={languages} visible={expandedVisible} onClose={handleCloseExpanded} />
            </div>
            <ContainerSelectionExpandedBox />
        </div>
    );
}