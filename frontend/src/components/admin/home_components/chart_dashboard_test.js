'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function DashboardChart() {
  const [charts] = useState({
    revenue: {
      series: [{ name: 'Doanh thu', data: [200, 400, 350, 500, 600, 750, 900] }],
      options: {
        chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 3 },
        fill: { opacity: 0.3 },
        colors: ['#3b82f6'],
        tooltip: { enabled: true },
      },
    },
    users: {
      series: [{ name: 'Người dùng mới', data: [50, 80, 120, 150, 200, 180, 220] }],
      options: {
        chart: { type: 'bar', toolbar: { show: false }, sparkline: { enabled: true } },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
        colors: ['#10b981'],
        tooltip: { enabled: true },
      },
    },
    growth: {
      series: [75],
      options: {
        chart: { type: 'radialBar', sparkline: { enabled: true } },
        colors: ['#f59e0b'],
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: {
              show: true,
              value: {
                formatter: () => '75%',
                fontSize: '18px',
              },
            },
          },
        },
      },
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-3xl shadow-lg w-full max-w-6xl mx-auto">
      {/* Biểu đồ Doanh thu */}
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-gray-700 font-semibold mb-3">Doanh thu</h3>
        <Chart options={charts.revenue.options} series={charts.revenue.series} type="area" height={200} />
      </div>

      {/* Biểu đồ Người dùng */}
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-gray-700 font-semibold mb-3">Người dùng mới</h3>
        <Chart options={charts.users.options} series={charts.users.series} type="bar" height={200} />
      </div>

      {/* Biểu đồ Tăng trưởng */}
      <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
        <h3 className="text-gray-700 font-semibold mb-3">Tỷ lệ tăng trưởng</h3>
        <Chart options={charts.growth.options} series={charts.growth.series} type="radialBar" height={200} />
      </div>
    </div>
  )
}