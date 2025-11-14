import Header from "@/components/header";

export default function Classes(){
    return(
        <>
            <Header/>
            <div className="pt-[45px]">
                <div className="tools px-8 py-4 w-full flex flex-row justify-end">
                    <button className="w-[150px] p-2 text-white font-medium text-sm bg-indigo-500 rounded-lg">Tạo lớp học</button>
                </div>
            </div>
        </>
    );
}