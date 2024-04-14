"use client"
import { useEffect, useState } from "react";
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import moment from "moment";
import { getSession } from "next-auth/react";
import { Category, Expense } from "@/types/api";
import { Session } from "next-auth";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import NewExpenseDialog from "@/app/ui/expenses/new-expense-dialog";
import ExpensesTable from "@/app/ui/expenses/expenses-table";
import { getExpenses } from "@/lib/services/expenseService";
import { getCategories } from "@/lib/services/categoriesService";
import { TableSkeleton } from "@/app/ui/components/Skeletons";
export default function ExpensesPage() {

  const [userData, setUserData] = useState<Session | undefined>()
  const [expenses, setExpenses] = useState<Array<Expense>>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [date, setDate] = useState<DateRange | undefined>({
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate(),
  })


  const fetchData = async () => {
    setIsLoading(true)

    const data = await getSession()

    if (data && date) {
      setUserData(data)

      const [expensesData, categoriesData] = await Promise.all([
        getExpenses(data.user.token, moment(date.from).format('YYYY-MM-DD'), moment(date.to).format('YYYY-MM-DD')),
        getCategories(data.user.token)
      ])

      setExpenses(expensesData.data.map((expense: Expense) => {
        return {
          ...expense,
          amount: expense.amount.toLocaleString('es-ES'),
          date: moment(expense.date).format('DD-MM-YYYY')
        }
      }))

      setCategories(categoriesData.data.filter((category: Category) => category.type === 'EXPENSES'))


    }

    setIsLoading(false)
  }


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Gastos</h1>
      <section className="flex items-center justify-end mb-4">
        <NewExpenseDialog categories={categories} userData={userData} reload={fetchData} />
      </section>
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
        <Button>
          <ArrowPathIcon onClick={fetchData} className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="mx-auto py-10">
          <TableSkeleton columns={['Concepto', 'Fecha', 'Categoría', 'Cantidad', 'Acciones']} />
        </div>
      ) : (
        <ExpensesTable categories={categories} userData={userData} reload={fetchData} data={expenses} />
      )}
    </>
  )
}