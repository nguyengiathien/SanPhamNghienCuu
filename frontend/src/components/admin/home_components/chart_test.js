'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

// import dynamic để tránh lỗi SSR (ApexCharts chỉ chạy ở client)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ChartExample() {
    const stockData = [
    { date: 'Jan', prices: { open: 34, high: 45, low: 31, close: 40 } },
    { date: 'Feb', prices: { open: 40, high: 50, low: 36, close: 44 } },
    { date: 'Mar', prices: { open: 44, high: 55, low: 41, close: 50 } },
    { date: 'Apr', prices: { open: 50, high: 60, low: 45, close: 55 } },
    { date: 'May', prices: { open: 55, high: 65, low: 50, close: 60 } },
    { date: 'Jun', prices: { open: 60, high: 70, low: 55, close: 65 } },
  ];
  const [chartData] = useState({
    series: [
      {
        name: 'Doanh thu',
        data: stockData,
        parsing: {
            x: 'date',
            y: ['prices.open', 'prices.high', 'prices.low', 'prices.close']
        }
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      colors: ['#3b82f6'], // màu theo Tailwind blue-500
      title: {
        text: 'Biểu đồ Doanh thu 6 tháng đầu năm',
        align: 'center',
        style: { fontSize: '16px', color: '#374151', fontFamily: 'var(--font-lexend)' }, // gray-700
      },
    },
  })

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-3xl mx-auto my-4">
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  )
}