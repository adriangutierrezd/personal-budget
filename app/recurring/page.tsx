import RecurringTable from "../ui/recurring/RecurringTable";
import NewRecurringDialog from "../ui/recurring/new-recurring-dialog";
export default function CategoriesPage(){
    return(
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gastos recurrentes</h1>
            <section className="flex items-center justify-end mb-4">
                <NewRecurringDialog/>
            </section>
            <RecurringTable/>
        </main>
    )
}