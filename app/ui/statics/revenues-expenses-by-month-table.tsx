"use client"
import { DataTable } from "../components/datatable";
import { ColumnDef } from "@tanstack/react-table"

interface Props {
    readonly data: any[];
}

export default function RevenuesExpensesByMonthTable({ data }: Props) {
    const columns: ColumnDef<any>[] = [
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