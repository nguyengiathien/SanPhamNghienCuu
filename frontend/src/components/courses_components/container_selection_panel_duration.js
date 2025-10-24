"use client";
import { useState } from "react";
import ContainerSelectionExpandedBox from "./container_selection_expanded_box";

export default function ContainerSelectionPanelDuration() {
    const durations = [
        { id: 1, title: "Less than 2 hours" },
        { id: 2, title: "2 to 10 hours" },
        { id: 3, title: "10 hours to 1 day" },
        { id: 4, title: "1 to 3 days" },
        { id: 5, title: "3 days to 1 week" },
        { id: 6, title: "1 week to 3 weeks" },
        { id: 7, title: "More than 3 weeks" },
    ];

    const [expandedVisible, setExpandedVisible] = useState(false);

    function handleMoreClick() {
        setExpandedVisible(true);
    }

    function handleCloseExpanded() {
        setExpandedVisible(false);
    }

    return (
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
    );
}