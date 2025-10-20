import TopicTag from "@/components/home_components/topic_tag";

export default function TopicBox() {
    const topics = ["Math", "Science", "History", "Art", "Technology", "Literature", "Music", "Sports"];

    return (
        <div className="bg-gray-100 p-4 w-max mx-auto mt-4 rounded-full flex flex-row items-center justify-center space-x-3 overflow-x-auto">
            {topics.map((topic, index) => (
                <TopicTag key={index} topic={topic} />
            ))}
        </div>
    );
}