"use client"
import * as React from "react"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { categoryTypes } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Session } from "next-auth";
import { storeCategory } from "@/lib/services/categoriesService";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { AlertDialogFooter } from "@/components/ui/alert-dialog";


const categoryForm = z.object({
  name: z.string().min(2).max(100),
  type: z.string({
    required_error: "Debes seleccionar una opción"
  }),
  color: z.string().min(6).max(10),
})

const formDefaultValues = {
  name: '',
  type: 'EXPENSES',
  color: '#000000'
}

interface Props {
  readonly userData: Session | undefined;
  readonly reload: () => void
}

export default function NewCategoryDialog({ userData, reload }: Props) {

  const [open, setOpen] = React.useState(false)
  const [openDesktop, setOpenDesktop] = React.useState(false)
  const { toast } = useToast()

  const newCategoryForm = useForm<z.infer<typeof categoryForm>>({
    resolver: zodResolver(categoryForm),
    defaultValues: formDefaultValues,
  })

  const { reset } = newCategoryForm


  // @ts-ignore
  const onSubmit = async (values: z.infer<typeof categoryForm>) => {

    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

      await storeCategory({
        token: userData.user.token,
        props: values
      })
      setOpen(false)
      setOpenDesktop(false)
      reload()
      reset({})
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ha ocurrido un error",
        description: error.message,
      })
    }

  }

  return (
    <>
      <div className="block md:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">Añadir categoría</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Detalles de la categoría</DrawerTitle>
            </DrawerHeader>
            <CategoriesForm handleSubmit={onSubmit} className="px-4" />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden md:block">
        <Dialog open={openDesktop} onOpenChange={setOpenDesktop}>
          <DialogTrigger asChild>
            <Button variant="outline">Añadir categoría</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalles de la categoría</DialogTitle>
            </DialogHeader>
            <CategoriesForm handleSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

interface CategoriesFormProps {
  readonly className?: string;
  readonly handleSubmit: (values: z.infer<typeof categoryForm>) => void;
}

function CategoriesForm({ className, handleSubmit }: CategoriesFormProps) {

  const newCategoryForm = useForm<z.infer<typeof categoryForm>>({
    resolver: zodResolver(categoryForm),
    defaultValues: formDefaultValues,
  })

  return (

    <Form {...newCategoryForm}>
      <form onSubmit={newCategoryForm.handleSubmit(handleSubmit)} className={cn("grid grid-cols-2 gap-4", className)}>
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
          name="type"
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
                  {categoryTypes.map((type) => {
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        {type.text}
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
          <Button className="w-full" type="submit">Guardar</Button>
        </AlertDialogFooter>
      </form>
    </Form>
  )
}
