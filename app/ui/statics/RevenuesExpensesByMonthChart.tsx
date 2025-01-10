"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MONTHS } from "@/lib/constants"


const chartConfig = {
  revenues: {
    label: "Ingresos",
    color: "#1A6BD8",
  },
  expenses: {
    label: "Gastos",
    color: "#EB4936",
  },
} satisfies ChartConfig


interface Props {
  readonly expensesByMonth: any[],
  readonly revenuesByMonth: any[]
}


const getChartData = ({ expensesByMonth, revenuesByMonth }: Props) => {
  const chData: any[] = [];

  expensesByMonth.forEach((e: any) => {
    const { yearMonth, total } = e;
    const monthName = MONTHS[e.month - 1];
    const monthIndex = chData.findIndex((v: any) => v.yearMonth === yearMonth);

    if (monthIndex !== -1) {
      chData[monthIndex] = {
        ...chData[monthIndex],
        expenses: total
      };
    } else {
      chData.push({
        yearMonth,
        month: monthName,
        year: e.year,
        expenses: total,
        revenues: 0
      });
    }
  });

  revenuesByMonth.forEach((r: any) => {
    const { yearMonth, total } = r;
    const monthName = MONTHS[r.month - 1];
    const monthIndex = chData.findIndex((v: any) => v.yearMonth === yearMonth);

    if (monthIndex !== -1) {
      chData[monthIndex] = {
        ...chData[monthIndex],
        revenues: total
      };
    } else {
      chData.push({
        yearMonth,
        month: monthName,
        year: r.year,
        expenses: 0,
        revenues: total
      });
    }
  });

  return chData;
};


export function RevenuesExpensesByMonthChart({ expensesByMonth, revenuesByMonth }: Props) {

  const chartData = getChartData({ expensesByMonth, revenuesByMonth })

  console.log(chartData)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos y gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="revenues"
              type="monotone"
              stroke="var(--color-revenues)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
