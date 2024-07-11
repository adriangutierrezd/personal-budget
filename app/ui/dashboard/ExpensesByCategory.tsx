"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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


interface Props {
    readonly expensesByCategory: Array<any>
}

export function ExpensesByCategory({ expensesByCategory }: Props) {
    const chartConfig = {
        amount: {
            label: "Gasto en €",
        }
    } satisfies ChartConfig

    const chartData = expensesByCategory.map((d: any) => {

        //@ts-ignore
        chartConfig[d.name] = {
            label: d.name, 
            color: d.color
        }

        return {
            categoryName: d.name,
            fill: d.color,
            amount: d.total
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gastos por categoría</CardTitle>
                {/* <CardDescription>Mes actual</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="categoryName"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <XAxis dataKey="amount" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="amount" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
