'use client';
import HeroCard from "../hero_card";
import { faLinesLeaning, faChalkboard, faFileLines, faQuestion } from "@fortawesome/free-solid-svg-icons";


export default function Hero() {
    const userData = JSON.parse(localStorage.getItem('user'));

    return (
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-6 flex flex-row items-center justify-center gap-15 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
            <HeroCard title={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "New course" : ""} ${(userData !== undefined && userData !== null && userData.role === "student") ? "My course" : ""}`} description={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "Create your own course." : ""} ${(userData && userData !== null && userData.role === "student") ? "Discover your own courses." : ""}`} icon={faLinesLeaning} color="green" />
            <HeroCard title={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "New class" : ""} ${(userData !== undefined && userData !== null && userData.role === "student") ? "My classes" : ""}`} description={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "Create your own class." : ""} ${(userData && userData !== null && userData.role === "student") ? "Discover your own courses." : ""}`} icon={faChalkboard} color="orange" />
            <HeroCard title={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "New test" : ""} ${(userData !== undefined && userData !== null && userData.role === "student") ? "My test" : ""}`} description={`${(userData !== undefined && userData !== null && userData.role === "provider") || !userData ? "Create your own test." : ""} ${(userData && userData !== null && userData.role === "student") ? "Discover your own tests." : ""}`} icon={faFileLines} color="gray" />       
            <HeroCard title="New question" description="Create your own question." icon={faQuestion} color="neutral" view={`${(userData !== undefined && userData !== null && userData.role === "provider")? "show" : "hidden"}`} />           
        </section>
    );
}