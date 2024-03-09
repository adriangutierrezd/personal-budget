import { useState } from "react";
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
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
import { Session } from "next-auth";
import { storeCategory } from "@/lib/services/categoriesService";


const categoryForm = z.object({
  name: z.string().min(2).max(100),
  color: z.string(),
})

interface Props{
  readonly userData: Session|undefined;
  readonly reload: () => void
}

export default function NewCategoryDialog({userData, reload}: Props) {

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const {toast} = useToast()

  const newCategoryForm = useForm<z.infer<typeof categoryForm>>({
    resolver: zodResolver(categoryForm),
    defaultValues: {
      name: '',
      color: '#000000'
    },
  })

  const {reset} = newCategoryForm


  // @ts-ignore
  const onSubmit = async (values: z.infer<typeof categoryForm>) => {

    try{

      if(!userData) throw new Error('Ha ocurrido un error de autenticación');

      await storeCategory({
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
        Añadir categoría
      </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalles de la categoría</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...newCategoryForm}>
            <form onSubmit={newCategoryForm.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <FormField
                control={newCategoryForm.control}
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
                control={newCategoryForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Color *</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
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