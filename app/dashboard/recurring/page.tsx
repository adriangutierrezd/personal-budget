"use client"
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Category, RecurringExpense } from "@/types/api";
import { Session } from "next-auth";
import { getCategories } from "@/lib/services/categoriesService";
import { TableSkeleton } from "@/app/ui/components/Skeletons";
import { getExpenses } from "@/lib/services/recurringService";
import RecurringExpensesTable from "@/app/ui/recurring/recurring-expenses-table";
import NewRecurringExpenseDialog from "@/app/ui/recurring/new-recurring-expense-dialog";

export default function RecurringPage() {


    const [userData, setUserData] = useState<Session | undefined>()
    const [expenses, setExpenses] = useState<Array<RecurringExpense>>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)



    const fetchData = async () => {
        setIsLoading(true)

        const data = await getSession()

        if (data) {
            setUserData(data)

            const [expensesData, categoriesData] = await Promise.all([
                getExpenses(data.user.token),
                getCategories(data.user.token)
            ])

            setExpenses(expensesData.data.map((expense: RecurringExpense) => {
                return {
                    ...expense,
                    amount: expense.amount.toLocaleString('es-ES'),
                }
            }))

            setCategories(categoriesData.data)

        }

        setIsLoading(false)
    }


    useEffect(() => {
        fetchData()
    }, [])



    return (
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Gastos recurrentes</h1>
            <section className="flex items-center justify-end mb-4">
                <NewRecurringExpenseDialog userData={userData} reload={fetchData} categories={categories} />
            </section>


            {isLoading ? (
                <div className="mx-auto py-10">
                    <TableSkeleton columns={['Concepto', 'Categoría', 'Cantidad', 'Acciones']} />
                </div>
            ) : (
                <RecurringExpensesTable data={expenses} reload={fetchData} userData={userData} categories={categories}/>
            )}

        </main>
    )
}