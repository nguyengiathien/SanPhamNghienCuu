"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer"
import Header from "@/components/header"
import InfoCard from "@/components/courses_components/course_overal/info_card";

export default function Review() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Tính toán chiều cao động dựa trên vị trí cuộn
    const maxHeight = 300; // chiều cao ban đầu
    const minHeight = 100; // chiều cao tối thiểu
    const height = Math.max(minHeight, maxHeight - scrollY * 0.2);

    return (
        <>
            <main>
                <Sidebar />
                <div className="ml-[50px]">
                    <Header />
                    <section className="relative z-1 w-full overflow-hidden bg-center bg-cover transition-all duration-150 ease-in-out" style={{ height: `${height}px`, backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=60')" }}>
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="flex-col items-end justify-start h-full bg-black/30 ">
                            <h1 className="sm:text-3xl md:text-[42px] font-bold text-white drop-shadow-lg absolute bottom-18 left-15 text-nowrap">
                                Hệ thống E-Learning
                            </h1>
                        </div>
                        <button className="bg-indigo-500 absolute bottom-18 left-130 text-white py-2 px-8 shadow-xs shadow-white/20 rounded-sm transition-[colors, shadow] duration-100 hover:shadow-none hover:bg-indigo-600 font-medium cursor-pointer" >Tham gia</button>
                    </section>
                    <section className="flex flex-row gap-1 justify-center z-8 absolute top-67 left-1/2 -translate-x-1/2 w-4/5 ml-[25px] bg-indigo-100/80 p-3 rounded-lg shadow-lg">
                        <InfoCard title="Tham gia" content="3.000.000 người" />
                        <InfoCard title="Đánh giá" content="3.000 lượt" />
                        <InfoCard title="Thời lượng" content="3 ngày" />
                        <InfoCard title="Tham gia" content="3.000.000" />
                        <InfoCard title="Nội dung" content="6 mô-đun" />

                    </section>
                    <section className="h-100">

                    </section>
                    <Footer />
                </div>
            </main>
        </>
    );
}