export default function ContainerSelectionExpandedBoxTopics({ topicsCategory }) {
    if (!topicsCategory || topicsCategory.length === 0) {
        return <div className="mt-4 text-gray-500">No topics available.</div>;
    }

    return (
        <div className="topics-box mt-10 flex flex-row items-center justify-evenly gap-2 flex-wrap">
            {topicsCategory.map((topic) => (
                <div key={topic.id} className="py-2 px-3 mb-2 bg-white border border-gray-200 rounded-full shadow-sm inline-block">
                    <h3 className="text-xs font-semibold text-gray-800">{topic.title}</h3>
                </div>
            ))}
        </div>
    );
}
