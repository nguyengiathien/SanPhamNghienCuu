import TopicsCategory from "@/components/courses_components/hero_topics_category";

export default function Hero() {
    return (
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-8 flex flex-row items-center justify-center gap-15 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
            <TopicsCategory />
        </section>
    );
}