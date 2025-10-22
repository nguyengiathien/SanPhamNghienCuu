import Sidebar from "@/components/sidebar_unlog";
import Footer from "@/components/footer";
import Hero from "@/components/courses_components/hero";
import Container_ from "@/components/courses_components/container";

export default function CoursesPage() {
  return (
    <>
      <div id="container" className=" min-h-screen">
        <Sidebar />
        <main className="bg-white w-full z-2 pl-[50px]">          
          <Hero />
          <Container_ />
          <Footer />
        </main>
      </div>
    </>
  );
}
