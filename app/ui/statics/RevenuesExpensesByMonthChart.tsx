"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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



export function RevenuesExpensesByMonth({ expensesByMonth, revenuesByMonth }: Props) {


  const chartData = getChartData({ expensesByMonth, revenuesByMonth })


  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos y gastos</CardTitle>
        {/* <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <Area
              dataKey="revenues"
              type="natural"
              fill="var(--color-revenues)"
              fillOpacity={0.4}
              stroke="var(--color-revenues)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
