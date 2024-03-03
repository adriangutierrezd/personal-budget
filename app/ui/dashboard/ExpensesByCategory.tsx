"use client"
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
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
  


  interface Props {
    readonly expensesByCategory: Array<any>
  }

  export default function ExpensesByCategory({ expensesByCategory }: Props) {

    const data = {
      labels: expensesByCategory.map((data) => data.name),
      datasets: [
        {
          label: 'Prueba label dataset',
          data: expensesByCategory.map((data) => data.total),
          backgroundColor: expensesByCategory.map((data) => data.color)
        }
      ],
    }

    return (
      <div>
        <Bar options={options} data={data} />
      </div>
    )
  }