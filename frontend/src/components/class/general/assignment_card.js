export default function AssignmentCard({ assignment }) {
    return (
        <div className="relative assignment-card border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-indigo-900 mb-2">{assignment.title}</h4>
            <p className="text-sm text-gray-500">Due Date: {assignment.dueDate}</p>
            <button className="mt-4 w-fit py-2 px-3 text-white text-center font-medium text-sm bg-indigo-500 rounded-md hover:bg-indigo-600 hover:cursor-pointer">Xem chi tiết</button>
        </div>
    );
}