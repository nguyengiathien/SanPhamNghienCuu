import ContainerContentsSearchTag from "./container_contents_search_tag";
import ContainerContentsCoursesWrapper from "./container_contents_courses_wrapper";
import PageNumber from "@/components/page_number";

export default function ContainerContents() {
    return (
        <div className="container-contents mx-4 py-4 w-full">
            {/* Content for Container Contents goes here */}
            <ContainerContentsSearchTag />
            <ContainerContentsCoursesWrapper />
            <PageNumber />
        </div>
    );
}