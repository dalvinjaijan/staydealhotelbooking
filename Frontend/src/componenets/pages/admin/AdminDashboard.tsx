import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, LineController, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { adminApi } from '../../../utils/axios/axiosconfig';

Chart.register(LineElement, LineController, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [salePeriod, setSalesPeriod] = useState<string>('daily');
    const [salesData, setSalesData] = useState<any>(null);
    const chartRef = useRef(null);
    const chartInstance = useRef<Chart | null>(null); // Store chart instance to prevent memory leaks

    const fetchReport = async (period: string) => {
        console.log('Fetching data for period:', period);
        const response = await adminApi.get('/fetchReport', { params: { period } });

        if (response.data) {
            console.log(response.data)
            setSalesData(response.data);
        }
        setSalesPeriod(period);
    };
    useEffect(() => {
        
        fetchReport("daily");
    }, []);

    useEffect(() => {
        console.log("Updated salePeriod:", salePeriod);
    }, [salePeriod]); // Logs salePeriod whenever it updates

    useEffect(() => {
        if (!salesData || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        // Destroy previous chart instance to prevent overlapping
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Define labels based on the selected period
        const labels = salePeriod === 'yearly'
            ? salesData.map((item) => new Date(item.year).getFullYear())
            : salePeriod === 'monthly'
                ? salesData.map((item) => item.monthName)
                : salesData.map((item) => item.day.split('T')[0]) ;

        // Define dataset based on the selected period
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
    }, [salesData, salePeriod]); // Runs whenever salesData or salePeriod updates

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <div className="flex gap-3 mb-4">
                <button className='w-20 bg-slate-500 mx-3' onClick={() => fetchReport("daily")}>Daily</button>
                <button className='w-20 bg-slate-500 mx-3' onClick={() => fetchReport('monthly')}>Monthly</button>
                <button className='w-20 bg-slate-500 mx-3' onClick={() => fetchReport('yearly')}>Yearly</button>
            </div>
            <canvas ref={chartRef} width="400" height="160"></canvas>
        </div>
    );
};

export default AdminDashboard;
