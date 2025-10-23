"use client";
import { useState } from "react";
import ContainerSelectionExpandedBox from "./container_selection_expanded_box";
import { IM_Fell_English } from "next/font/google";

export default function ContainerSelectionPanelLanguages() {
    const languages = [
        {id: 1, title: "English"},
        {id: 2, title: "Spanish"},
        {id: 3, title: "French"},
        {id: 4, title: "German"},
        {id: 5, title: "Chinese"},
        {id: 6, title: "Japanese"},
        {id: 7, title: "Korean"},
        {id: 8, title: "Russian"},
        {id: 9, title: "Portuguese"},
        {id: 10, title: "Italian"},
        {id: 11, title: "Arabic"},
        {id: 12, title: "Hindi"},
        {id: 13, title: "Bengali"},
        {id: 14, title: "Punjabi"},
        {id: 15, title: "Javanese"},
        {id: 16, title: "Vietnamese"},
    ];

    const [expandedVisible, setExpandedVisible] = useState(false);

    function handleMoreClick() {
        setExpandedVisible(true);
    }

    function handleCloseExpanded() {
        setExpandedVisible(false);
    }

    return (
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
    );
}