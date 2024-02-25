"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: string
  amount: number
  name: string
  category: string
  date: string
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "name",
    header: "Concepto",
  },
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "category.name",
    header: "Categoría",
  },
  {
    accessorKey: "amount",
    header: "Cantidad",
  },
]
