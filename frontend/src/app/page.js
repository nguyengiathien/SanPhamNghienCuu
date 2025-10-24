import Footer from '@/components/footer';
import Sidebar from '@/components/sidebar';
import Hero from '@/components/home_components/hero';
import Courses from '@/components/courses';
import TopicBox from '@/components/home_components/topic_box';
import TopCourses from '@/components/home_components/top_courses';
import Offers from '@/components/home_components/offers'; 

import { Container } from 'postcss';

export default function Home() {
  return (
    <>
        <div id="container" className=" min-h-screen">
          <Sidebar />
          <main className="bg-white w-full z-2 pl-[50px]">
            <Hero />
            <TopicBox />
            <TopCourses />
            <Courses />
            <Offers />
            <Footer />
          </main>
        </div>
    </>
  );
}