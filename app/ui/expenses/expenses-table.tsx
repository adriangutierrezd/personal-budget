"use client"
import { Category, Expense } from "@/types/api";
import moment from "moment";
import { useState } from "react";
import {  updateExpense, destroyExpense } from "@/lib/services/expenseService";
import { DataTable } from "../components/datatable";
import { ColumnDef, Row } from "@tanstack/react-table"
import { PencilIcon, TrashIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Session } from "next-auth";


interface Props{
  readonly data: Expense[];
  readonly reload: () => void;
  readonly userData: Session|undefined;
  readonly categories: Category[]
}

const expenseForm = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional(),
  date: z.date(),
  categoryId: z.string(),
  amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0')
})

export default function ExpensesTable({data, categories, userData, reload}: Props) {

  const {toast} = useToast()

  const handleUpdateExpense = async ({
    expenseId,
    props
  }: {
    expenseId: number,
    props: object
  }) => {
    try{

      if(!userData) throw new Error('Ha ocurrido un error de autenticación');

      await updateExpense({
        token: userData.user.token,
        expenseId,
        props
      })

      toast({
        title: "Correcto",
        description: "Gasto actualizado con éxito",
      })

      reload()
    }catch(error: any){
      toast({
        variant: "destructive",
        title: "Ha ocurrido un error",
        description: error.message,
      })
    }
  }

  const handleDeleteExpense = async ({
    expenseId
  }: {
    expenseId: number
  }) => {
    try{

      if(!userData) throw new Error('Ha ocurrido un error de autenticación');

      await destroyExpense({
        token: userData.user.token,
        expenseId
      })

      toast({
        title: "Correcto",
        description: "Gasto eliminado con éxito",
      })

      reload()
    }catch(error: any){
      toast({
        variant: "destructive",
        title: "Ha ocurrido un error",
        description: error.message,
      })
    }
  }

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "name",
      header: "Concepto",
    },
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "category.name",
      header: "Categoría",
    },
    {
      accessorKey: "amount",
      header: "Cantidad",
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <ExpensesTableActions handleDeleteExpense={handleDeleteExpense} handleUpdateExpense={handleUpdateExpense} categories={categories} row={row} />
    }
  ]

  return (
    <DataTable columns={columns} data={data} />
  )
}

interface ExpensesTableActionsProps {
  readonly row: Row<any>
  readonly categories: Array<any>
  readonly handleDeleteExpense: ({
    expenseId
  }: {
    expenseId: number
  }) => void,
  readonly handleUpdateExpense: ({
    expenseId,
    props
  }: {
    expenseId: number,
    props: object
  }) => void
}

const ExpensesTableActions = ({ row, categories, handleUpdateExpense, handleDeleteExpense }: ExpensesTableActionsProps) => {

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const editExpenseForm = useForm<z.infer<typeof expenseForm>>({
    resolver: zodResolver(expenseForm),
    defaultValues: {
      name: row.original.name,
      date: moment(row.original.date, 'DD-MM-YYYY').toDate(),
      amount: Number(row.original.amount.replace(",", ".")),
      description: row.original.description ?? '',
      categoryId: row.original.categoryId.toString()
    },
  })

  const onSubmit = async (values: z.infer<typeof expenseForm>) => {
    const payload = {
      ...values,
      date: moment(values.date).format('YYYY-MM-DD')
    }

    handleUpdateExpense({
      expenseId: row.original.id,
      props: payload 
    })
  }

  return (
    <div className="flex space-x-4">

      <AlertDialog open={isEditDialogOpen} onOpenChange={() => setIsEditDialogOpen(!isEditDialogOpen)}>
        <AlertDialogTrigger asChild>
          <PencilIcon className="cursor-pointer h-4 w-4 text-blue-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalles del gasto</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...editExpenseForm}>
            <form onSubmit={editExpenseForm.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <FormField
                control={editExpenseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editExpenseForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Fecha del gasto *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editExpenseForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => {
                          return (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editExpenseForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Importe *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editExpenseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter className="col-span-2">
                <Button onClick={() => setIsEditDialogOpen(false)} type="button" variant="outline">Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
        <TrashIcon className="cursor-pointer h-4 w-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogContent>
            ¿Quieres continuar? Esta acción no se puede deshacer
          </AlertDialogContent>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteExpense({expenseId: row.original.id})}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      

    </div>
  )
}

