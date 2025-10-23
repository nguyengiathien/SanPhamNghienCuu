"use client";


export default function CourseCard({ course, role }) {
    let varRole = role.role.role;
    varRole.role === undefined ? varRole : varRole = varRole.role;
    console.log(varRole);

    return (
        <div className="course-card border border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 w-[13rem] mx-auto relative">
            <img src={`${course.imageUrl}`} alt={course.title} className="w-full h-26 object-cover rounded mb-4" />
            <h3 className="font-semibold text-sm text-gray-800 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-xs mb-4">{course.description}</p>
            <button className="enroll-button bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors duration-300 text-sm">
                {varRole === "student" || varRole === "unlog" ? "Enroll" : "View"}
            </button>
            <p className="text-gray-600 text-sm absolute bottom-4 right-4">{course.cost}</p>
        </div>
    );
}