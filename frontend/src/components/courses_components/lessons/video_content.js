export default function VideoContent({ videoUrl }) {
    return (
        <div className="w-full max-w-[800px] mx-auto h-full flex justify-center items-center bg-black">
            <video
                src={videoUrl}
                controls
                className="w-full h-full"
            /> 
        </div>
    )
}