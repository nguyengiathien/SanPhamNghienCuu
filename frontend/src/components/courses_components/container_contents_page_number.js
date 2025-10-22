export default function ContainerContentsPageNumber() {
    return (
        <div className="container-contents-page-number flex justify-center items-center my-6">
            {/* Content for Container Contents Page Number goes here */}
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">Previous</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">1</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">2</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">3</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">...</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">10</button>
            <button className="mx-2 px-3 py-1 border-2 border-indigo-300 bg-indigo-500 text-white rounded text-xs shadow cursor-pointer hover:bg-white hover:shadow-none hover:text-black">Next</button>
        </div>
    );
}