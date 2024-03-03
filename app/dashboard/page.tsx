"use client"
import { useEffect, useState } from "react";
import ExpensesByCategory from "../ui/dashboard/ExpensesByCategory";
import StatsCards from "../ui/dashboard/StatsCards";
import ExpensesTable from "../ui/dashboard/ExpensesTable";
import { getSession } from "next-auth/react";
import { getExpenses, getExpensesByCategory } from "@/lib/services/expenseService";
import { getRevenues } from "@/lib/services/revenueService";
import { Expense, Revenue } from "@/types/api";
import moment from "moment";
import { Session } from "next-auth";

export default function Dashboard () {

  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [expenses, setExpenses] = useState<Array<Expense>>([])
  const [revenues, setRevenues] = useState<Array<Revenue>>([])
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [totalSaved, setTotalSaved] = useState<number>(0)
  const [expensesByCategory, setExpensesByCategory] = useState<Array<any>>([])

  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    setIsLoading(true)

    const data = await getSession()

    if(data){
      const [expensesData, revenuesData, expenseByCategory] = await Promise.all([
        getExpenses(data.user.token, startOfMonth, endOfMonth),
        getRevenues(data.user.token, startOfMonth, endOfMonth),
        getExpensesByCategory(data.user.token, startOfMonth, endOfMonth)
      ])

      setExpenses(expensesData.data.map((expense: Expense) => {
        return {
          ...expense,
          amount: expense.amount.toLocaleString('es-ES'),
          date: moment(expense.date).format('DD-MM-YYYY')
        }
      }))

      setRevenues(revenuesData.data)
      setExpensesByCategory(expenseByCategory.data)
      const { expensesSum, revenuesSum, saved } = getMainDataFromMonth(expensesData.data, revenuesData.data)
      setTotalExpense(expensesSum)
      setTotalRevenue(revenuesSum)
      setTotalSaved(saved)

    }

    setIsLoading(false)
  }

  const getMainDataFromMonth = (expenses: Expense[], revenues: Revenue[]) => {
    let expense = 0
    expenses.forEach((e: Expense) => {
        expense += e.amount
    })

    let revenue = 0
    revenues.forEach((e: Revenue) => {
        revenue += e.amount
    })

    return { expensesSum: expense, revenuesSum: revenue, saved: revenue - expense }
  }


  return (
    <main className="p-6">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Panel de control</h1>
      </section>
      {isLoading ? (<p>Cargando...</p>) : (<>
        <StatsCards totalSaved={totalSaved} totalExpense={totalExpense} totalRevenue={totalRevenue} /> 
        <ExpensesByCategory expensesByCategory={expensesByCategory}/>
        <ExpensesTable reload={fetchData} data={expenses}/>
      </>)}

    </main>
  );
}
