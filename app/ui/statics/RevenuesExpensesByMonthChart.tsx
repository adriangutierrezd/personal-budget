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
    const monthName = MONTHS[e.month - 1];
    const monthIndex = chData.findIndex((v: any) => v.month === monthName);

    if (monthIndex !== -1) {
      chData[monthIndex] = {
        ...chData[monthIndex],
        expenses: e.total
      };
    } else {
      chData.push({
        month: monthName,
        revenues: 0,
        expenses: e.total
      });
    }
  });

  revenuesByMonth.forEach((r: any) => {
    const monthName = MONTHS[r.month - 1];
    const monthIndex = chData.findIndex((v: any) => v.month === monthName);

    if (monthIndex !== -1) {
      chData[monthIndex] = {
        ...chData[monthIndex],
        revenues: r.total
      };
    } else {
      chData.push({
        month: monthName,
        expenses: 0,
        revenues: r.total
      });
    }
  });

  return chData;
};
  

export function RevenuesExpensesByMonthChart({ expensesByMonth, revenuesByMonth }: Props) {

    const chartData = getChartData({ expensesByMonth, revenuesByMonth })
    
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
