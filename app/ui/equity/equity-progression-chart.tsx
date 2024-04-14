import React from 'react';
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
import { EquityPerDate } from '@/types/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    plugins: {
        title: {
            display: false,
            text: 'Chart.js Bar Chart - Stacked',
        },
    },
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};


interface Props {
    readonly rawData: EquityPerDate[];
}

export function EquityProgessionChart({ rawData }: Props) {

    const labels = rawData.map((data) => data.date)

    const data = {
        labels,
        datasets: [
            {
                label: 'Activos',
                data: rawData.map((data) => data.totalAssets),
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 0',
            },
            {
                label: 'Pasivos',
                data: rawData.map((data) => data.totalLiabilities),
                backgroundColor: 'rgb(75, 192, 192)',
                stack: 'Stack 0',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
