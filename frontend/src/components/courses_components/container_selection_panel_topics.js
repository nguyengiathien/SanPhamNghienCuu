export default function ContainerSelectionPanelTopics() {
    const topicsCategory = [
        {
            id: 1,
            title: "Web Development",
            topics: [
                { id: 1, title: "HTML" },
                { id: 2, title: "CSS" },
                { id: 3, title: "JavaScript" },
            ]
        },
        {
            id: 2,
            title: "Data Science",
            topics: [
                { id: 1, title: "Python" },
                { id: 2, title: "R" },
                { id: 3, title: "SQL" },
            ]
        },
        {
            id: 3,
            title: "Machine Learning",
            topics: [
                { id: 1, title: "Supervised Learning" },
                { id: 2, title: "Unsupervised Learning" },
                { id: 3, title: "Reinforcement Learning" },
            ]
        },
        {
            id: 4,
            title: "ELearning",
            topics: [
                { id: 1, title: "Online Courses" },
                { id: 2, title: "Virtual Classrooms" },
                { id: 3, title: "Learning Management Systems" },
            ]
        }
    ];

    return (
        <div className="container-selection-panel-topics mb-4 after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
            {/* Content for Container Selection Panel Topics goes here */}
            <h3 className="font-bold leading-normal text-base mb-2">Topics</h3>
            <ul>
                {topicsCategory.map(category => (
                    <li key={category.id} className="mb-2">
                        <h4 className="font-medium text-sm leading-normal">{category.title}</h4>
                        <ul>
                            {category.topics.map(topic => (
                                <li key={topic.id} className="text-xs leading-normal flex items-center gap-1">
                                    <input type="checkbox" /> {topic.title}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <div className="mt-1">
                <button className="text-xs font-semibold leading-normal underline cursor-pointer hover:text-blue-500" >More</button>
            </div>
        </div>
    );
}