"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function Header(course) {
    const [isDimmed, setIsDimmed] = useState(false);
    console.log(course);

    useEffect(() => {
        const timer = setTimeout(() => setIsDimmed(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`w-full bg-white/50 shadow-lg py-1 px-2 fixed transition-opacity duration-500 ${isDimmed ? "opacity-40" : "opacity-100"} hover:opacity-100 z-2`}>
            <a href="/courses" className="text-gray-800">Khóa học</a>
            <FontAwesomeIcon icon={faAngleRight} />
            <a href="/courses/review" course={course}>{course.name}</a>
        </div>
    );
}