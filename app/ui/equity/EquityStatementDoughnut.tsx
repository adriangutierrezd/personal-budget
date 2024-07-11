"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig as ChartConfigMaster,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { EquityStatement } from "@/types/api"

type ChartConfigItem = {
    label: string;
    color: string;
};

type ChartConfig = Record<string, ChartConfigItem>;

const createChartConfig = (items: { name: string; color: string }[]): ChartConfig => {
    const config: ChartConfig = {};
    const nameCount: Record<string, number> = {};

    items.forEach((item) => {
        let name = item.name.replace(/\s+/g, '');

        if (nameCount[name] !== undefined) {
            nameCount[name] += 1;
            name += nameCount[name];
        } else {
            nameCount[name] = 0;
        }

        config[name] = {
            label: item.name,
            color: item.color,
        };
    });

    return config;
};


const getChartData = ({ rawData }: { rawData: EquityStatement[] }) => {

    const chData: any[] = []
    rawData.forEach((d) => {
        
        const catgIndex = chData.findIndex((value: any) => value.category === d.category.name)
        if(catgIndex === -1){
            chData.push({
                category: d.category.name,
                amount: d.amount,
                fill: d.category.color
            })
        }else{
            const prevAmount = chData[catgIndex]?.amount ?? 0
            chData[catgIndex] = {
                ...chData[catgIndex],
                amount: prevAmount + d.amount
            }
        }
    })

    return chData
      
}

interface Props {
    readonly rawData: EquityStatement[];
    readonly title: string;
}

export function EquityStatementDoughnut({ rawData, title }: Props) {

    const chartData = getChartData({rawData})
    const chartConfig = createChartConfig(rawData.map((value) => {
        return {
            name: value.category.name,
            color: value.category.color
        }
    })) satisfies ChartConfigMaster

  const getTotalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {getTotalAmount.toLocaleString('es-ES')} €
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
