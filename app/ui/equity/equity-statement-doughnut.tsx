import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { EquityStatement } from '@/types/api';
import { groupEquityStatementsByCategory } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    readonly rawData: EquityStatement[];
}

export function EquityStatementDoughnut({ rawData }: Props) {


    const formattedData = groupEquityStatementsByCategory(rawData)

    const data = {
        labels: Object.keys(formattedData),
        datasets: [
          {
            data: Object.keys(formattedData).map((key: any) => formattedData[key].totalAmount),
            backgroundColor: Object.keys(formattedData).map((key: any) => formattedData[key].backgorundColor),
            borderColor: Object.keys(formattedData).map((key: any) => formattedData[key].borderColor),
            borderWidth: 1,
          },
        ],
      };

  return <Doughnut data={data} />;
}
