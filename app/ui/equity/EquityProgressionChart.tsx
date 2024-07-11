"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { EquityPerDate } from "@/types/api"


const chartConfig = {
  assets: {
    label: "Activos",
    color: "#1A6BD8",
  },
  liabilities: {
    label: "Pasivos",
    color: "#EB4936",
  },
  equity: {
    label: "Patrimonio",
    color: "#10CC55",
  },
} satisfies ChartConfig

interface Props {
    readonly rawData: EquityPerDate[];
}

const getChartData = ({rawData}: Props) => {
    return rawData.map((value) => {
        return {
            month: value.date,
            assets: value.totalAssets,
            liabilities: value.totalLiabilities,
            equity: value.totalEquity
        }
    })
}

export function EquityProgressionChart({rawData}: Props) {


    const chartData = getChartData({ rawData })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresión de patrimonio</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="equity" fill="var(--color-equity)" radius={4} />
            <Bar dataKey="assets" fill="var(--color-assets)" radius={4} />
            <Bar dataKey="liabilities" fill="var(--color-liabilities)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
