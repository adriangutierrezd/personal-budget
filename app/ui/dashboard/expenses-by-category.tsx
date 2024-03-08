"use client"
import { hexToRgba } from '@/lib/utils';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  

  export const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
  };
  


  interface Props {
    readonly expensesByCategory: Array<any>
  }

  export default function ExpensesByCategory({ expensesByCategory }: Props) {


    const data = {
      labels: expensesByCategory.map((data) => data.name),
      datasets: [
        {
          label: 'Gasto por categoría',
          data: expensesByCategory.map((data) => data.total),
          backgroundColor: expensesByCategory.map((data) => hexToRgba(data.color, 0.6)),
          borderColor: expensesByCategory.map((data) => hexToRgba(data.color, 1)),
          borderWidth: 2,
        }
      ],
    }

    return (
      <div>
        <Bar options={options} data={data} />
      </div>
    )
  }