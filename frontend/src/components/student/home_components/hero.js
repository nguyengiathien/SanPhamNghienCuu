import HeroCard from "@/components/home_components/hero_card";
import { faLinesLeaning, faChalkboard, faFileLines } from "@fortawesome/free-solid-svg-icons";


export default function Hero() {
    return (
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-8 flex flex-row items-center justify-center gap-15 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
            <HeroCard title="My courses" description="Discover your own courses." icon={faLinesLeaning} color="green" />
            <HeroCard title="My classes" description="Discover your own classes." icon={faChalkboard} color="orange" />
            <HeroCard title="My tests" description="Discover your own tests." icon={faFileLines} color="gray" />
        </section>
    );
}