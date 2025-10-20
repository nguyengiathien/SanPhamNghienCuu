import CurrentClassesCard from "@/components/student_home_components/current_courses_card";

export default function CurrentCourses() {
    return (
        <section className="current-courses-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Current Courses</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <CurrentClassesCard course={{ name: "Course 1"}} />
                <CurrentClassesCard course={{ name: "Course 2"}} />
                <CurrentClassesCard course={{ name: "Course 3"}} />
                <CurrentClassesCard course={{ name: "Course 4"}} />
                <CurrentClassesCard course={{ name: "Course 5"}} />
            </div>
        </section>
    );
}