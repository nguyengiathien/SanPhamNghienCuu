import Sidebar from "@/components/sidebar_unlog";
import Footer from "@/components/footer";
import Hero from "@/components/courses_components/hero";

export default function CoursesPage() {
  return (
    <>
      <div id="container" className=" min-h-screen">
        <Sidebar />
        <main className="bg-white w-full z-2 pl-[50px]">          
          <Hero />
          <Footer />
        </main>
      </div>
    </>
  );
}
