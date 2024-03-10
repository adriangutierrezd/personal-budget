"use client"
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
import { useState } from "react";
import { storeExpense } from "@/lib/services/recurringService";
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
  categoryId: z.string(),
  amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0')
})


interface NewExpenseDialogProps {
  readonly userData: Session|undefined;
  readonly categories: Array<any>,
  readonly reload: () => void
}

export default function NewRecurringExpenseDialog({categories, userData, reload}: NewExpenseDialogProps) {


  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const editExpenseForm = useForm<z.infer<typeof expenseForm>>({
    resolver: zodResolver(expenseForm),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      categoryId: ''
    },
  })


    const {reset} = editExpenseForm

    const onSubmit = async (values: z.infer<typeof expenseForm>) => {

  
      try{
  
        if(!userData) throw new Error('Ha ocurrido un error de autenticación');
  
        await storeExpense({
          token: userData.user.token,
          props: values
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