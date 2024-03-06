"use client"
import { Revenue } from "@/types/api";
import moment from "moment";
import { useState } from "react";
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
import { Session } from "next-auth";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { destroyRevenue, updateRevenue } from "@/lib/services/revenueService";


const revenueForm = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional(),
  date: z.date(),
  amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0')
})


interface Props {
  readonly data: Revenue[];
  readonly userData: Session | undefined;
  readonly reload: () => void
}

export default function RevenuesTable({ data, userData, reload }: Props) {


  const { toast } = useToast()

  const handleUpdateRevenue = async ({
    revenueId,
    props
  }: {
    revenueId: number,
    props: object
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

      await updateRevenue({
        token: userData.user.token,
        props,
        revenueId
      })

      toast({
        title: "Correcto",
        description: "Ingreso actualizado con éxito",
      })

      reload()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ha ocurrido un error",
        description: error.message,
      })
    }
  }

  const handleDeleteRevenue = async ({
    revenueId
  }: {
    revenueId: number
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

      await destroyRevenue({
        token: userData.user.token,
        revenueId
      })

      toast({
        title: "Correcto",
        description: "Ingreso eliminado con éxito",
      })

      reload()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ha ocurrido un error",
        description: error.message,
      })
    }
  }

  const columns: ColumnDef<Revenue>[] = [
    {
      accessorKey: "name",
      header: "Concepto",
    },
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "amount",
      header: "Importe",
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <RevenuesTableActions handleDeleteRevenue={handleDeleteRevenue} handleUpdateRevenue={handleUpdateRevenue} row={row} />
    }
  ]

  return (
    <div className="py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

interface RevenuesTableActionsProps {
  readonly row: Row<any>
  readonly handleDeleteRevenue: ({
    revenueId
  }: {
    revenueId: number
  }) => void,
  readonly handleUpdateRevenue: ({
    revenueId,
    props
  }: {
    revenueId: number,
    props: object
  }) => void
}

const RevenuesTableActions = ({ row, handleUpdateRevenue, handleDeleteRevenue }: RevenuesTableActionsProps) => {

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const updateRevenueForm = useForm<z.infer<typeof revenueForm>>({
    resolver: zodResolver(revenueForm),
    defaultValues: {
      name: row.original.name,
      date: moment(row.original.date, 'DD-MM-YYYY').toDate(),
      amount: Number(row.original.amount.replace(",", ".")),
      description: row.original.description ?? '',
    },
  })

  const onSubmit = async (values: z.infer<typeof revenueForm>) => {
    const payload = {
      ...values,
      date: moment(values.date).format('YYYY-MM-DD')
    }

    handleUpdateRevenue({
      revenueId: row.original.id,
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
            <AlertDialogTitle>Detalles del ingreso</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...updateRevenueForm}>
        <form onSubmit={updateRevenueForm.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <FormField
            control={updateRevenueForm.control}
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
            control={updateRevenueForm.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Fecha del ingreso *</FormLabel>
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
            control={updateRevenueForm.control}
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
            control={updateRevenueForm.control}
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
            <AlertDialogTitle>Eliminar ingreso</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogContent>
            ¿Quieres continuar? Esta acción no se puede deshacer
          </AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteRevenue({ revenueId: row.original.id })}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  )
}