import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function ExpensesTable() {
  const data = await getData()

  return (
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
