import ExpensesTable from "../../ui/dashboard/ExpensesTable"
import NewExpenseDialog from "../../ui/expenses/new-expense-dialog"

export default function ExpensesPage(){
    return(
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gastos</h1>
            <section className="flex items-center justify-end mb-4">
                <NewExpenseDialog/>
            </section>
            <ExpensesTable/>
        </main>
    )
}