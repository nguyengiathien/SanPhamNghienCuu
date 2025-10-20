export default function CourseItem({ course }) {
    return (
        <div className="course-item border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 w-[18rem] mx-auto relative">
            <img src="/course-placeholder.png" alt={course.title} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
            <button className="enroll-button bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300">
                Enroll Now
            </button>
            <p className="text-gray-600 text-sm absolute bottom-4 right-4">{course.cost}</p>
        </div>
    );
}