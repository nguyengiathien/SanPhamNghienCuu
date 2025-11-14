"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/header";
import Footer from "@/components/footer"
import AddressBar from "@/components/address_bar"
import CourseCard from "@/components/course_card";



export default function Review(course) {
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
                <div className="pt-[45px]">
                    <AddressBar course={course} />
                    <section className="relative bg-indigo-200/20 z-1 w-full overflow-hidden bg-center bg-cover transition-all duration-150 ease-in-out min-h-[200px] h-fit pt-[30px]">
                        <div className="flex-col items-end justify-start h-full ml-[60px] mt-[20px]">
                            <h1 className="sm:text-3xl md:text-[32px] font-medium text-blue-700 drop-shadow-lg text-nowrap mb-2">Hệ thống E-Learning</h1>
                            <div className="font-normal flex flex-row flex-nowrap text-sm mb-4">
                                <u>Giảng viên:</u>
                                <img src="/no_avatar.jpg" className="w-[25px] rounded-full ml-3 mr-2"></img>
                                <span>Instructor Name</span>
                            </div>
                            <button className="bg-indigo-500 text-white py-1 px-4 shadow-xs shadow-white/20 rounded-sm transition-[colors, shadow] duration-100 hover:shadow-none hover:bg-indigo-600 font-medium cursor-pointer" >Tham gia</button>
                        </div>
                        <div className="absolute bottom-0 right-0 grid grid-cols-2 md:grid-cols-4 justify-center py-1 px-4 md:w-[500px] w-[300px] m-auto shadow-lg bg-indigo-200/30 rounded-tl-2xl">
                            <div className="relative py-3 bg-transparent w-full after:content-[''] after:absolute after:-right-1 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-2/4 after:bg-gray-400 last:after:hidden">
                                <h4 className="font-medium text-sm text-center mb-2 text-black">Tham gia</h4>
                                <p className="font-extralight text-xs text-center text-black">3.000.000 người</p>
                            </div>
                            <div className="relative py-3 bg-transparent w-full md:after:content-[''] md:after:absolute md:after:-right-1 md:after:top-1/2 md:after:-translate-y-1/2 md:after:w-px md:after:h-2/4 md:after:bg-gray-400 md:last:after:hidden">
                                <h4 className="font-medium text-sm text-center mb-2 text-black">Đánh giá</h4>
                                <p className="font-extralight text-xs text-center text-black">3.000 lượt</p>
                            </div>
                            <div className="relative py-3 bg-transparent w-full after:content-[''] after:absolute after:-right-1 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-2/4 after:bg-gray-400 last:after:hidden">
                                <h4 className="font-medium text-sm text-center mb-2 text-black">Thời lượng</h4>
                                <p className="font-extralight text-xs text-center text-black">3 ngày</p>
                            </div>
                            <div className="relative py-3 bg-transparent w-full after:content-[''] after:absolute after:-right-1 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-2/4 after:bg-gray-400 last:after:hidden">
                                <h4 className="font-medium text-sm text-center mb-2 text-black">Nội dung</h4>
                                <p className="font-extralight text-xs text-center text-black">6 mô-đun</p>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-[1000px] m-auto my-4 flex flex-col items-center">
                        <div className="relative">
                            <div className="py-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[400px] after:h-[2px] after:bg-indigo-300 w-fit">
                                <a href="#intro" className="px-4 font-medium text-[16px] hover:font-bold font-montserrat py-2">Mô tả</a>
                                <a href="#modun" className="px-4 font-medium text-[16px] hover:font-bold font-montserrat py-2">Mô-đun</a>
                                <a href="#advice" className="px-4 font-medium text-[16px] hover:font-bold font-montserrat py-2">Lời khuyên</a>
                                <a href="#rate" className="px-4 font-medium text-[16px] hover:font-bold font-montserrat py-2">Đánh giá</a>
                            </div>
                        </div>
                        <div id="intro" className="w-full my-2 mx-16 px-8 py-4">
                            <div className="w-full mb-8">
                                <h3 className="text-left w-full font-medium text-[16px] mb-2">Bài học này sẽ nói về?</h3>
                                <p className="text-justify ml-6 text-sm leading-[1.5]">Khóa học này được thiết kế nhằm giúp người học nắm vững kiến thức cơ bản và ứng dụng thực tiễn trong lĩnh vực [chủ đề khóa học]. Thông qua các bài học sinh động, ví dụ minh họa và hoạt động tương tác, học viên sẽ phát triển được tư duy phân tích, kỹ năng giải quyết vấn đề, cũng như khả năng vận dụng kiến thức vào thực tế. Khóa học phù hợp với [đối tượng học viên], đặc biệt là những ai mong muốn [mục tiêu học tập].</p>
                            </div>

                            <div className="w-full mb-8">
                                <h3 className="text-left w-full font-medium text-[16px] mb-2">Học viên sẽ được học về:</h3>
                                <div className="flex flex-row flex-wrap gap-3">
                                    <p className="py-1 px-2 w-fit rounded-2xl text-sm bg-amber-200">Nội dung 1</p>
                                    <p className="py-1 px-2 w-fit rounded-2xl text-sm bg-amber-200">Nội dung 2 nhưng mà dài hơn nhìn cho nó lạ</p>
                                    <p className="py-1 px-2 w-fit rounded-2xl text-sm bg-amber-200">Nội dung 3 hơi dài nè</p>
                                </div>
                            </div>
                            <div className="w-full">
                                <h3 className="text-left w-full font-medium text-[16px] mb-2">Chuẩn đầu ra của khóa học là:</h3>
                                <ul className="list-disc ml-12 text-sm leading-[1.5]">
                                    <li>Nội dung 1</li>
                                    <li>Nội dung 2 nhưng mà dài hơn nhìn cho nó lạ</li>
                                    <li>Nội dung 3 hơi dài nè</li>
                                </ul>
                            </div>
                        </div>
                        <div id="modun" className="w-full my-2 mx-16 px-8 py-4">
                            <h3 className="text-left w-full font-medium text-[16px] mb-2">Khóa học gồm có 5 mô-đun:</h3>
                            <div className="w-full ml-6 text-sm leading-6">
                                <p>Mô-đun 1: Nội dung mô-đun 1.</p>
                                <p>Mô-đun 2: Nội dung mô-đun 2.</p>
                                <p>Mô-đun 3: Nội dung mô-đun 3.</p>
                                <p>Mô-đun 4: Nội dung mô-đun 4.</p>
                                <p>Mô-đun 5: Nội dung mô-đun 5.</p>
                            </div>
                        </div>
                        <div id="advice" className="w-full my-2 mx-16 px-8 py-4">
                            <p>Sáng tạo lời khuyên tùy thuộc vào nội dung khóa học.</p>
                        </div>
                        <div id="rate" className="w-full my-2 mx-16 px-8 py-4">
                            <div id="rate_number">Đánh giá khóa học: </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </main>
        </>
    );
}