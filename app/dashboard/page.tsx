"use client"
import { useEffect, useState } from "react";
import ExpensesByCategory from "../ui/dashboard/expenses-by-category";
import StatsCards from "../ui/dashboard/StatsCards";
import ExpensesTable from "../ui/expenses/expenses-table";
import { getSession } from "next-auth/react";
import { getExpenses, getExpensesByCategory } from "@/lib/services/expenseService";
import { getRevenues } from "@/lib/services/revenueService";
import { Category, Expense, Revenue } from "@/types/api";
import moment from "moment";
import { Session } from "next-auth";
import { getCategories } from "@/lib/services/categoriesService";
import NewExpenseDialog from "../ui/expenses/new-expense-dialog";

export default function Dashboard () {

  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const [userData, setUserData] = useState<Session|undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<Category[]>([])
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
      setUserData(data)
      const [expensesData, revenuesData, expenseByCategory, categoriesData] = await Promise.all([
        getExpenses(data.user.token, startOfMonth, endOfMonth),
        getRevenues(data.user.token, startOfMonth, endOfMonth),
        getExpensesByCategory(data.user.token, startOfMonth, endOfMonth),
        getCategories(data.user.token)
      ])

      setExpenses(expensesData.data.map((expense: Expense) => {
        return {
          ...expense,
          amount: expense.amount.toLocaleString('es-ES'),
          date: moment(expense.date).format('DD-MM-YYYY')
        }
      }))

      setCategories(categoriesData.data)
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
        <section className="flex items-center justify-end mb-4">
        <NewExpenseDialog categories={categories} userData={userData} reload={fetchData}/>
      </section>
        <ExpensesTable categories={categories} userData={userData} reload={fetchData} data={expenses}/>
      </>)}

    </main>
  );
}
