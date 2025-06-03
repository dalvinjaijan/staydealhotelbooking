import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, LineController, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { hostApi } from '../../../utils/axios/axiosconfig';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/redux/store';
import HostHeader from './HostHeader';
import { Pie } from "react-chartjs-2";

Chart.register(LineElement, ArcElement, LineController, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const HostDashboard = () => {
    const { hostInfo } = useSelector((state: RootState) => state.host);
    const [salePeriod, setSalesPeriod] = useState<string>('daily');
    const [salesData, setSalesData] = useState<any>(null);
    const [pieData, setPieData] = useState<any>(null);

    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null); // Store chart instance to prevent memory leaks

    const piechartReport = async () => {
        const hostId = hostInfo?.hostId;
        const response = await hostApi.get('/piechartReport', { params: { hostId } });

        if (response.data) {
            setPieData(response.data);
        }
    };

    useEffect(() => {
        piechartReport();
    }, []);
    useEffect(() => {
 
        fetchReport("daily");
    }, []);

    const fetchReport = async (period: string) => {
        const hostId = hostInfo?.hostId;
        const response = await hostApi.get('/fetchReport', { params: { period, hostId } });

        if (response.data) {
            setSalesData(response.data);
        }
        setSalesPeriod(period);
    };

    const data = {
        labels: pieData?.map((hotel: any) => hotel.hotelName) || [],
        datasets: [
            {
                data: pieData?.map((hotel: any) => hotel.bookingCount) || [],
                backgroundColor: ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#AF19FF"],
                hoverBackgroundColor: ["#005F9E", "#D69E23", "#D6622E", "#009973", "#881AFF"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
    };

    useEffect(() => {
        if (!salesData || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const labels = salePeriod === 'yearly'
            ? salesData.map((item) => new Date(item.year).getFullYear())
            : salePeriod === 'monthly'
                ? salesData.map((item) => item.monthName)
                : salesData.map((item) => item.day.split('T')[0]);

        const dataPoints = salePeriod === 'yearly'
            ? salesData.map((item) => item.saleYear[0]?.noOfBookingPerYear || 0)
            : salePeriod === 'monthly'
                ? salesData.map((item) => item.saleMonth[0]?.monthlySalesData || 0)
                : salesData.map((item) => item.saleDay[0]?.noOfBookingPerDay || 0);

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sales',
                        data: dataPoints,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [salesData, salePeriod]);

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <HostHeader />
            <h2 className="text-2xl font-bold mb-4 text-center">Host Dashboard</h2>
            
            {/* Buttons */}
            <div className="flex justify-center gap-4 mb-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => fetchReport("daily")}>Daily</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => fetchReport("monthly")}>Monthly</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => fetchReport("yearly")}>Yearly</button>
            </div>

            {/* Charts Container */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Line Chart */}
                <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">Sales Report</h3>
                    <div className="w-full h-[350px]">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">No of bookings per hotel</h3>
                    <div className="flex justify-center">
                        <Pie data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
