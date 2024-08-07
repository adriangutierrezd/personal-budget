"use client"
import { useEffect, useState } from "react"
import moment from "moment"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { getSession } from "next-auth/react"
import { getExpensesByCategory, getExpensesByMonth } from "@/lib/services/expenseService"
import { getRevenuesByMonth } from "@/lib/services/revenueService"
import { MONTHS } from "@/lib/constants"
import RevenuesExpensesByMonthTable from "@/app/ui/statics/revenues-expenses-by-month-table"
import { EquityPerDate, MonthData, MonthRawData } from "@/types/api"
import { getEquityPerDate } from "@/lib/services/equityService"
import { ExpensesByCategory } from "@/app/ui/dashboard/ExpensesByCategory"
import { RevenuesExpensesByMonthChart } from "@/app/ui/statics/RevenuesExpensesByMonthChart"
import { EquityProgressionChart } from "@/app/ui/equity/EquityProgressionChart"

export default function StaticsPage() {

  const today = moment();
  const startDate = today.clone().subtract(12, 'months').startOf('month');
  startDate.startOf('month');
  const endDate = today.clone().endOf('month');

  const [expensesByMonth, setExpensesByMonth] = useState<Array<any>>([])
  const [revenuesByMonth, setRevenuesByMonth] = useState<Array<any>>([])
  const [expensesByCategory, setExpensesByCategory] = useState<Array<any>>([])
  const [revExpData, setRevExpData] = useState<Array<MonthData>>([])
  const [equityPerDate, setEquityPerDate] = useState<Array<EquityPerDate>>([])
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate.toDate(),
    to: endDate.toDate(),
  })

  const fetchData = async () => {
    const data = await getSession()

    if (data && date) {

      const fromDate = moment(date.from).format('YYYY-MM-DD')
      const toDate = moment(date.to).format('YYYY-MM-DD')

      const [expenseByCategoryData, expByMonth, revByMonth, equityData] = await Promise.all([
        getExpensesByCategory(data.user.token, fromDate, toDate),
        getExpensesByMonth(data.user.token, fromDate, toDate),
        getRevenuesByMonth(data.user.token, fromDate, toDate),
        getEquityPerDate(data.user.token, fromDate, toDate)
      ])

      setEquityPerDate(equityData.data)
      setExpensesByCategory(expenseByCategoryData.data)
      setRevenuesByMonth(revByMonth.data)
      setExpensesByMonth(expByMonth.data)

      const revExp: MonthData[] = []
      revByMonth.data.forEach((rev: MonthRawData, index: number) => {
        revExp[index] = {
          monthName: MONTHS[rev.month - 1],
          year: rev.year,
          earnedAmount: rev.total,
          spentAmount: 0,
          totalSaved: rev.total,
          savedPercentage: 100
        }
      })

      expByMonth.data.forEach((exp: MonthRawData, index: number) => {
        revExp[index] = {
          ...revExp[index],
          monthName: MONTHS[exp.month - 1],
          year: exp.year,
          spentAmount: exp.total,
          totalSaved: Number(revExp[index]?.earnedAmount ?? 0) - exp.total,
          savedPercentage: ((Number(revExp[index]?.earnedAmount ?? 0) - exp.total) / Number(revExp[index]?.earnedAmount ?? 0) * 100).toFixed(2)
        }
      })

      setRevExpData(revExp.map((r: any) => {
        return {
          ...r,
          earnedAmount: r.earnedAmount ? r.earnedAmount.toLocaleString('es-ES') : 0,
          spentAmount: r.spentAmount ? r.spentAmount.toLocaleString('es-ES') : 0,
          savedPercentage: `${r.savedPercentage.toString().replace('.', ',')} %`,
          totalSaved: r.totalSaved.toLocaleString('es-ES'),
        }
      }))

    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Estadísticas</h1>
      <div className="flex items-center space-x-4 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
              </svg>

              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", {locale: es})} -{" "}
                    {format(date.to, "LLL dd, y", {locale: es})}
                  </>
                ) : (
                  format(date.from, "LLL dd, y", {locale: es})
                )
              ) : (
                <span>Selecciona un rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              locale={es}
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={fetchData}>
          <ArrowPathIcon className="h-4 w-4" />
        </Button>
      </div>
      <RevenuesExpensesByMonthChart expensesByMonth={expensesByMonth} revenuesByMonth={revenuesByMonth} />
      <RevenuesExpensesByMonthTable data={revExpData} />
      <ExpensesByCategory expensesByCategory={expensesByCategory} />
      <EquityProgressionChart rawData={equityPerDate} />
    </>
  )
}