"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [isDimmed, setIsDimmed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsDimmed(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`w-full bg-indigo-200/90 shadow-lg py-1 px-2 fixed transition-opacity duration-500 ${isDimmed ? "opacity-40" : "opacity-100"} hover:opacity-100 z-2`}>
            <button className="cursor-pointer px-2">
                <FontAwesomeIcon icon={faAngleLeft} className="text-gray-900 !w-[20px] !h-[20px]" />
            </button>
        </div>
    );
}