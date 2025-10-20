export default function TopicTag({ topic }) {
    return (
        <div className="topic-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-[colors, transform] duration-300 cursor-pointer hover:shadow-md whitespace-nowrap">
            {topic}
        </div>
    );
}