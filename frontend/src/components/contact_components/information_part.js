import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function InformationPart() {
    return (
        <div className="w-1/2 px-25 py-10 bg-radial-[at_25%_25%] from-violet-950 via-indigo-700 via-50% to-violet-800 to-75% h-screen relative flex flex-col justify-center !shadow-[0_5px_20px_10px_rgba(1,1,1,0.2)] animate-wave border-r border-white/10">
            <h1 className="font-bold text-3xl my-4 text-white">Liên hệ với chúng tôi</h1>
            <p className="font-normal text-sm text-justify leading-6 text-white/70"><i>Hệ thống học tập trực tuyến giúp người học chủ động hơn trong việc tiếp thu kiến thức mọi lúc, mọi nơi. Giao diện thân thiện, dễ sử dụng cùng các công cụ tương tác thông minh mang đến trải nghiệm học tập linh hoạt và hiệu quả. Nền tảng hỗ trợ đa dạng khóa học, giúp người dùng phát triển kỹ năng và mở rộng tri thức theo nhu cầu của bản thân.</i></p>
            <ul className="p-4">
                <li className="flex flex-row gap-3 my-3 text-white relative fit-content">
                    <FontAwesomeIcon icon={faSchool} className="!w-[18px] !h-[18px] aspect-square ml-3 mt-2 z-2" />
                    <span className="font-normal text-sm text-wrap z-2 mt-2">280 An Dương Vương phường Chợ Quán, Thành phố Hồ Chí Minh</span>
                    {/* <div className="shadow-lg blur-sm w-full h-full rounded-lg bg-white/20 absolute z-1 py-4"></div> */}
                </li>
                <li className="flex flex-row gap-3 my-3 text-white relative ">
                    <FontAwesomeIcon icon={faPhone} className="!w-[18px] !h-[18px] aspect-square ml-3 z-2 mt-2" />
                    <span className="font-normal text-sm text-wrap z-2 mt-2">0909123456 - 0989738421</span>
                    {/* <div className="shadow-lg blur-sm w-full h-full rounded-lg bg-white/20 absolute z-1 py-4"></div> */}
                </li>
                <li className="flex flex-row gap-3 my-3 text-white relative ">
                    <FontAwesomeIcon icon={faEnvelope} className="!w-[18px] !h-[18px] aspect-square ml-3 z-2 mt-2" />
                    <span className="font-normal text-sm text-wrap z-2 mt-2">4801103042@student.hcmue.edu.vn</span>
                    {/* <div className="shadow-lg blur-sm w-full h-full rounded-lg bg-white/20 absolute z-1 py-4"></div> */}
                </li>
            </ul>
        </div>
    );
}