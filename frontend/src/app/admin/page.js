import Footer from '@/components/footer';
import Sidebar from '@/components/sidebar_admin';
import Hero from '@/components/admin_home_components/hero';
import ChartTest from '@/components/admin_home_components/chart_test';
import DashboardChart from '@/components/admin_home_components/chart_dashboard_test';

import { Container } from 'postcss';

export default function Home() {
  return (
    <>
        <div id="container" className=" min-h-screen">
          <Sidebar />
          <main className="bg-white w-full z-2 pl-[50px]">
            <Hero />
            <ChartTest />
            <DashboardChart />
            <Footer />
          </main>
        </div>
    </>
  );
}