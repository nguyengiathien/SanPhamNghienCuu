import ContainerContentsSearchTag from "./container_contents_search_tag";
import ContainerContentsCoursesWrapper from "./container_contents_courses_wrapper";
import ContainerContentsPageNumber from "./container_contents_page_number";

export default function ContainerContents(role) {
    return (
        <div className="container-contents mx-4 py-4 w-full">
            {/* Content for Container Contents goes here */}
            <ContainerContentsSearchTag />
            <ContainerContentsCoursesWrapper role={role} />
            <ContainerContentsPageNumber />
        </div>
    );
}