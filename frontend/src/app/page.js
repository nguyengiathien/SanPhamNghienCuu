'use client';

import Footer from '@/components/footer';
import Sidebar from '@/components/header';
import OfferCard from '@/components/Offer_card';
import CourseItem from "@/components/course_card";
import ClassCard from '@/components/class_card';

import { Container } from 'postcss';

export default function Home() {
  const userData = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div id="container" className="min-h-screen">
        <Sidebar />
        <main className="bg-white w-full z-2 pt-[45px]">
          <section className={`current-courses-section p-8 ${userData && userData !== null && (userData.role === "student" || userData.role === "provider") ? "show" : "hidden"}`}>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Current Courses</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <CourseItem course={{ title: "Course 1", description: "Description for Course 1", cost: "Free" }} />
              <CourseItem course={{ title: "Course 3", description: "Description for Course 3", cost: "Free" }} />
              <CourseItem course={{ title: "Course 7", description: "Description for Course 7", cost: "Free" }} />
            </div>
          </section>
          <section className={`current-courses-section p-8 ${userData && userData !== null && (userData.role === "student" || userData.role === "provider") ? "show" : "hidden"}`}>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Current Classes</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <ClassCard classes={{ name: "Class 1" }} />
              <ClassCard classes={{ name: "Class 2" }} />
              <ClassCard classes={{ name: "Class 3" }} />
              <ClassCard classes={{ name: "Class 4" }} />
              <ClassCard classes={{ name: "Class 5" }} />
            </div>
          </section>
          <section className="courses-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Top Courses</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <CourseItem course={{ title: "Course 1", description: "Description for Course 1", cost: "Free" }} />
              <CourseItem course={{ title: "Course 2", description: "Description for Course 2", cost: "Free" }} />
              <CourseItem course={{ title: "Course 3", description: "Description for Course 3", cost: "Free" }} />
              <CourseItem course={{ title: "Course 4", description: "Description for Course 4", cost: "Free" }} />
            </div>
          </section>
          <section className="courses-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Courses</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <CourseItem course={{ title: "Course 1", description: "Description for Course 1", cost: "Free" }} />
              <CourseItem course={{ title: "Course 2", description: "Description for Course 2", cost: "Free" }} />
              <CourseItem course={{ title: "Course 3", description: "Description for Course 3", cost: "$300" }} />
              <CourseItem course={{ title: "Course 4", description: "Description for Course 4", cost: "$400" }} />
              <CourseItem course={{ title: "Course 5", description: "Description for Course 5", cost: "$500" }} />
              <CourseItem course={{ title: "Course 6", description: "Description for Course 6", cost: "$600" }} />
              <CourseItem course={{ title: "Course 7", description: "Description for Course 7", cost: "$700" }} />
              <CourseItem course={{ title: "Course 8", description: "Description for Course 8", cost: "$800" }} />
            </div>
          </section>
          <section className="offers-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Offers</h1>
            <div className="offer-list flex flex-row items-start justify-center flex-wrap gap-10">
              <OfferCard
                offer={{
                  title: "Special Discount on Course A",
                  description: "Get 20% off on Course A for a limited time.",
                  cost: "$79.99"
                }}
              />
              <OfferCard
                offer={{
                  title: "Bundle Offer: Course B + Course C",
                  description: "Enroll in all Courses for $149.99 per month.",
                  cost: "$149.99"
                }}
              />
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
}