export default function InfoCard({title, content}){
    return (
        <div className="py-3 shadow-lg rounded-lg bg-white border-2 border-indigo-950/30 w-1/4">
            <h4 className="font-bold text-xl text-center mb-2 text-indigo-950">{title}</h4>
            <p className="font-normal text-sm text-center text-indigo-900">{content}</p>
        </div>
    );
}