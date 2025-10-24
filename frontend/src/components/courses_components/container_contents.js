import ContainerContentsSearchTag from "./container_contents_search_tag";
import CourseCard from "@/components/courses_components/container_content_courses_card";
import PageNumber from "@/components/page_number";

export default function ContainerContents() {
    const courses = [
        { id: 1, title: "Course 1", description: "Description 1", imageUrl: "/course1.png", author: "Author 1", rating: 4.5, cost: 100 },
        { id: 2, title: "Course 2", description: "Description 2", imageUrl: "/course2.png", author: "Author 2", rating: 4.0, cost: 150 },
        { id: 3, title: "Course 3", description: "Description 3", imageUrl: "/course3.png", author: "Author 3", rating: 3.5, cost: 200 },
        { id: 4, title: "Course 4", description: "Description 4", imageUrl: "/course4.png", author: "Author 4", rating: 5.0, cost: 250 },
        { id: 5, title: "Course 5", description: "Description 5", imageUrl: "/course5.png", author: "Author 5", rating: 4.2, cost: 300 },
        { id: 6, title: "Course 6", description: "Description 6", imageUrl: "/course6.png", author: "Author 6", rating: 3.8, cost: 350 },
        { id: 7, title: "Course 7", description: "Description 7", imageUrl: "/course7.png", author: "Author 7", rating: 4.7, cost: 400 },
        { id: 8, title: "Course 8", description: "Description 8", imageUrl: "/course8.png", author: "Author 8", rating: 4.1, cost: 450 },
        { id: 9, title: "Course 9", description: "Description 9", imageUrl: "/course9.png", author: "Author 9", rating: 3.9, cost: 500 },
        { id: 10, title: "Course 10", description: "Description 10", imageUrl: "/course10.png", author: "Author 10", rating: 4.3, cost: 550 },
        { id: 11, title: "Course 11", description: "Description 11", imageUrl: "/course11.png", author: "Author 11", rating: 4.6, cost: 600 },
        { id: 12, title: "Course 12", description: "Description 12", imageUrl: "/course12.png", author: "Author 12", rating: 3.7, cost: 650 },
        { id: 13, title: "Course 13", description: "Description 13", imageUrl: "/course13.png", author: "Author 13", rating: 4.4, cost: 700 },
        { id: 14, title: "Course 14", description: "Description 14", imageUrl: "/course14.png", author: "Author 14", rating: 4.8, cost: 750 },
        { id: 15, title: "Course 15", description: "Description 15", imageUrl: "/course15.png", author: "Author 15", rating: 3.6, cost: 800 },
        { id: 16, title: "Course 16", description: "Description 16", imageUrl: "/course16.png", author: "Author 16", rating: 4.9, cost: 850 },
        { id: 17, title: "Course 17", description: "Description 17", imageUrl: "/course17.png", author: "Author 17", rating: 4.0, cost: 900 },
        { id: 18, title: "Course 18", description: "Description 18", imageUrl: "/course18.png", author: "Author 18", rating: 3.5, cost: 950 },
        { id: 19, title: "Course 19", description: "Description 19", imageUrl: "/course19.png", author: "Author 19", rating: 4.2, cost: 1000 },
        { id: 20, title: "Course 20", description: "Description 20", imageUrl: "/course20.png", author: "Author 20", rating: 4.5, cost: 1050 },
    ];
    return (
        <div className="container-contents mx-4 py-4 w-full">
            {/* Content for Container Contents goes here */}
            <ContainerContentsSearchTag />
            <div className="@container">
                <div className="container-contents-courses-wrapper grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-4">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
            <PageNumber />
        </div>
    );
}