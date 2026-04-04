import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import InformationPart from "@/components/contact_components/information_part";
import FormPart from "@/components/contact_components/form_part";

export default function Contact() {
    return (
        <>
            <div id="container" className=" min-h-screen">
                <Header />
                <main className="bg-white w-full z-2 pl-[50px]">
                    <div className="flex flex-row items-center justify-between w-full min-h-[calc(100vh-50px)]">
                        <InformationPart />
                        <FormPart />
                    </div>
                </main>
            </div>
        </>
    );
}