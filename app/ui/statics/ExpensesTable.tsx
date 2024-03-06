"use client"
import { Expense, columns } from "../statics/expenses-columns"
import moment from "moment";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getExpenses } from "@/lib/services/expenseService";


export default function ExpensesTable() {


  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const [expenses, setExpenses] = useState<number>(0)

  useEffect(() => {
    getSession().then((data) => {
        fetchExpenses(data)
    })
  })

  const fetchExpenses = async (data) => {
      const expenses = await getExpenses(data.user.token, startOfMonth, endOfMonth)
      console.log(expenses)
      setExpenses(expenses)
  }


  return (
    <div className="container mx-auto py-10">
    </div>
  )
}
