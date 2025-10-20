import CourseItem from "@/components/course_card";

export default function Courses() {
    return (
        <section className="courses-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Top Courses</h1>
            <div className="course-list flex flex-row items-start justify-center-safe flex-wrap gap-4">
                <CourseItem course={{ title: "Course 1", description: "Description for Course 1", cost: "Free" }} />
                <CourseItem course={{ title: "Course 2", description: "Description for Course 2", cost: "Free" }} />
                <CourseItem course={{ title: "Course 3", description: "Description for Course 3", cost: "Free" }} />
                <CourseItem course={{ title: "Course 4", description: "Description for Course 4", cost: "Free" }} />
            </div>
        </section>
    );
}