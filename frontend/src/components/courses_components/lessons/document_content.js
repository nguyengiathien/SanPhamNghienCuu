export default function DocumentContent({ document }) {
    let content = document || "No document content available."
    
    return (
        <pre className="w-full h-full px-8 py-4 flex justify-start items-center bg-white text-gray-800 whitespace-pre-wrap">
{content}
        </pre>
    )
}