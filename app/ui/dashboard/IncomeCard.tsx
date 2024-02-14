"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from 'moment'
import { getExpenses } from "@/lib/services/revenueService";
import { getSession } from "next-auth/react";
import { Expense } from "@/types/api";
import { CurrencyEuroIcon } from "@heroicons/react/24/outline";

export default function IncomeCard(){

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD'); 

    const [totalIncome, setTotalIncome] = useState(0)

    useEffect(() => {
        getSession().then(fetchExpenses)
    })

    const fetchExpenses = async(data) => {
        console.log(data)
        const expenses = await getExpenses(data.user.token, startOfMonth, endOfMonth)
        let income = 0
        expenses.data.forEach((e: Expense) => {
            console.log(e)
            income += e.amount
        })
        setTotalIncome(income)        
    }
    
    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                Ingresos totales
            </CardTitle>
            <CurrencyEuroIcon className="h-5 w-5" stroke="currentColor" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{totalIncome} €</div>
            {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
            </p> */}
        </CardContent>
    </Card>
    )
}