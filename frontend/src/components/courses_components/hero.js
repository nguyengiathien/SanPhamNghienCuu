"use client";
import { useState } from "react";
import TopicsCategory from "@/components/courses_components/hero_topics_category";
import SearchBox from "@/components/search_box";

export default function Hero() {
    const userData = JSON.parse(localStorage.getItem('user'));

    const [searchValue, setSearchValue] = useState("");
    const handleSearchSubmit = (value) => {
        setSearchValue(value);
        // You can add additional logic here for when the search is submitted
    }

    return (
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-8 flex xl:flex-row sm:flex-col items-center xl:justify-evenly sm:justify-center sm:gap-6 xl:gap-15 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
            <TopicsCategory />
            <SearchBox placeholder="Search for topics..." value={searchValue} onSubmit={handleSearchSubmit} />
            <button className={`bg-gradient-to-br from-blue-50 to-indigo-300 border border-indigo-200 rounded-2xl py-2 px-3 shadow-xl font-semibold hover:shadow-none hover:from-indigo-300 hover:to-indigo-300 text-lg cursor-pointer ${userData !== undefined && userData !== null && userData.role === "student" ? "show" : "hidden"}`}>My courses</button>
        </section>
    );
}