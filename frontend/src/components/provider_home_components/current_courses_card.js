export default function CurrentCoursesCard({ course }) {
    return (
        <div className="course-item border border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 w-[13rem] mx-auto relative">
            <h3 className="font-semibold text-lg text-gray-800">{course.name}</h3>
        </div>
    );
}