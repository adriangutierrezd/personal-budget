"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyEuroIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import moment from 'moment'
import { getRevenues } from "@/lib/services/revenueService";
import { getExpenses } from "@/lib/services/expenseService";
import { getSession } from "next-auth/react";
import { Expense, Revenue } from "@/types/api";


export default function StatsCards() {


  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [totalSaved, setTotalSaved] = useState<number>(0)

  useEffect(() => {
    getSession().then((data) => {
        fetchExpenses(data)
        fetchRevenues(data)
        setTotalSaved(totalRevenue - totalExpense)
    })
  })

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
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ingresos totales
                    </CardTitle>
                    <CurrencyEuroIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRevenue.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p> */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gatos</CardTitle>
                    <CreditCardIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalExpense.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p> */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ahorro neto
                    </CardTitle>
                    <WalletIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSaved.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p> */}
                </CardContent>
            </Card>
        </div>
    )
}