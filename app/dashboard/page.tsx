"use client"
import { useEffect, useState } from "react";
import ExpensesByCategory from "../ui/statics/ExpensesByCategory";
import StatsCards from "../ui/dashboard/StatsCards";
import ExpensesTable from "../ui/dashboard/ExpensesTable";
import { getSession } from "next-auth/react";
import { getExpenses } from "@/lib/services/expenseService";
import { getRevenues } from "@/lib/services/revenueService";
import { Expense, Revenue } from "@/types/api";
import moment from "moment";

export default function Dashboard () {

  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [totalSaved, setTotalSaved] = useState<number>(0)

  useEffect(() => {
    fetchData()
  })

  const fetchData = async () => {
    setIsLoading(true)
    const data = await getSession()
    if(data){
        await fetchExpenses(data)
        await fetchRevenues(data)
        setTotalSaved(totalRevenue - totalExpense)
    }

    setIsLoading(false)
  } 

  const fetchExpenses = async (data) => {
      const expenses = await getExpenses(data.user.token, startOfMonth, endOfMonth)
      let expense = 0
      expenses.data.forEach((e: Expense) => {
          expense += e.amount
      })
      setTotalExpense(expense)
  }

  const fetchRevenues = async (data) => {
      const revenues = await getRevenues(data.user.token, startOfMonth, endOfMonth)
      let totalRevenue = 0
      revenues.data.forEach((e: Revenue) => {
          totalRevenue += e.amount
      })
      setTotalRevenue(totalRevenue)
  }


  return (
    <main className="p-6">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Panel de control</h1>
      </section>
      <StatsCards totalSaved={totalSaved} totalExpense={totalExpense} totalRevenue={totalRevenue} /> 
      <ExpensesByCategory/>
      <ExpensesTable/>
    </main>
  );
}
