import CourseItem from "@/components/course_card";

export default function Courses() {
    return (
        <section className="courses-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Courses</h1>
            <div className="course-list flex flex-row items-start justify-center-safe flex-wrap gap-4">
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
    );
}