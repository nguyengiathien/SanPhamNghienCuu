export default function InfoCard({title, content}){
    return (
        <div className="relative py-3 bg-transparent w-1/4 after:content-[''] after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-3/4 after:bg-gray-300 last:after:hidden">
            <h4 className="font-medium text-lg text-center mb-2 text-indigo-950">{title}</h4>
            <p className="font-extralight text-xs text-center text-indigo-900">{content}</p>
        </div>
    );
}