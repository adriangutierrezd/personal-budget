"use client"
import moment from "moment";
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
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
import { useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { storeExpense } from "@/lib/services/expenseService";
import { Session } from "next-auth";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const expenseForm = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional(),
  date: z.date(),
  categoryId: z.string(),
  amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0')
})


interface NewExpenseDialogProps {
  readonly userData: Session|undefined;
  readonly categories: Array<any>,
  readonly reload: () => void
}

export default function NewExpenseDialog({categories, userData, reload}: NewExpenseDialogProps) {


  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const editExpenseForm = useForm<z.infer<typeof expenseForm>>({
    resolver: zodResolver(expenseForm),
    defaultValues: {
      name: '',
      date: new Date(),
      amount: 0,
      description: '',
      categoryId: ''
    },
  })


    const {reset} = editExpenseForm

    const onSubmit = async (values: z.infer<typeof expenseForm>) => {
      const payload = {
        ...values,
        date: moment(values.date).format('YYYY-MM-DD')
      }
  
      try{
  
        if(!userData) throw new Error('Ha ocurrido un error de autenticación');
  
        await storeExpense({
          token: userData.user.token,
          props: payload
        })
        reload()
        setIsEditDialogOpen(false)
        reset({})
      }catch(error: any){
        toast({
          variant: "destructive",
          title: "Ha ocurrido un error",
          description: error.message,
        })
      }
  
  }

  return (
    <AlertDialog open={isEditDialogOpen} onOpenChange={() => setIsEditDialogOpen(!isEditDialogOpen)}>
    <AlertDialogTrigger asChild>
      <Button type="button" variant="outline">
        Añadir gasto
      </Button>
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
  )
}