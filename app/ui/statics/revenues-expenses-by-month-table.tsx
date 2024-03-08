"use client"
import { DataTable } from "../components/datatable";
import { ColumnDef } from "@tanstack/react-table"
import { MonthData } from "@/types/api";

interface Props {
    readonly data: MonthData[];
}

export default function RevenuesExpensesByMonthTable({ data }: Props) {
    const columns: ColumnDef<MonthData>[] = [
        {
            accessorKey: "monthName",
            header: "Mes",
        },
        {
            accessorKey: "year",
            header: "Año",
        },
        {
            accessorKey: "earnedAmount",
            header: "Ingresos",
        },
        {
            accessorKey: "spentAmount",
            header: "Gastos",
        },
        {
            accessorKey: "totalSaved",
            header: "Ahorro",
        },
        {
            accessorKey: "savedPercentage",
            header: "% Ahorro",
        },
    ]

    return (
        <div className="mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}