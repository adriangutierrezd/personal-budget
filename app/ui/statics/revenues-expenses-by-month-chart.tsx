"use client"
import React from 'react';
import { MONTHS } from '@/lib/constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
  



interface Props {
    readonly expensesByMonth: any[],
    readonly revenuesByMonth: any[]
}

export default function RevenuesExpensesByMonth({expensesByMonth, revenuesByMonth}: Props){

    const labels = expensesByMonth.map((e: any) => MONTHS[e.month - 1]);
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: revenuesByMonth.map((e: any) => e.total),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Gastos',
          data: expensesByMonth.map((e: any) => e.total),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    return(
        <Line options={options} data={data} />
    )
}