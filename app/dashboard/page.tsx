import ExpensesByCategory from "../ui/statics/ExpensesByCategory";
import StatsCards from "../ui/dashboard/StatsCards";
import ExpensesTable from "../ui/dashboard/ExpensesTable";

export default function Dashboard () {

  return (
    <main className="p-6">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Panel de control</h1>
      </section>
      <StatsCards /> 
      <ExpensesByCategory/>
      <ExpensesTable/>
    </main>
  );
}
