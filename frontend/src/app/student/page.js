import Footer from '@/components/footer';
import Sidebar from '@/components/sidebar';
import Hero from '@/components/student/home_components/hero';
import Courses from '@/components/courses';
import TopicBox from '@/components/home_components/topic_box';
import TopCourses from '@/components/home_components/top_courses';
import Offers from '@/components/home_components/offers'; 
import CurrentClasses from '@/components/student/home_components/current_classes';
import CurrentCourses from '@/components/student/home_components/current_courses';

import { Container } from 'postcss';

export default function Home() {
  return (
    <>
        <div id="container" className=" min-h-screen">
          <Sidebar />
          <main className="bg-white w-full z-2 pl-[50px]">
            <Hero />
            <TopicBox />
            <CurrentClasses />
            <CurrentCourses />
            <TopCourses />
            <Courses />
            <Offers />
            <Footer />
          </main>
        </div>
    </>
  );
}