import { Category } from "@/types/api";
import { Session } from "next-auth";
import { DataTable } from "../components/datatable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod"
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
import { destroyCategory, updateCategory } from "@/lib/services/categoriesService";
import { PencilIcon } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { categoryTypes } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  readonly data: Category[];
  readonly userData: Session | undefined;
  readonly reload: () => void
}


const categoryForm = z.object({
  name: z.string().min(2).max(100),
  color: z.string().min(6).max(10),
  type: z.string({
    required_error: "Debes seleccionar una opción"
  }),
})

export default function CategoriesTable({ data, userData, reload }: Props) {


  const { toast } = useToast()

  // @ts-ignore
  const handleUpdateCategory = async ({
    categoryId,
    props
  }: {
    categoryId: number,
    props: object
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

      await updateCategory({
        token: userData.user.token,
        props,
        categoryId
      })

      toast({
        title: "Correcto",
        description: "Categoría actualizada con éxito",
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

  // @ts-ignore
  const handleDeleteCategory = async ({
    categoryId
  }: {
    categoryId: number
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

      await destroyCategory({
        token: userData.user.token,
        categoryId
      })

      toast({
        title: "Correcto",
        description: "Categoría eliminada con éxito",
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


  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({row}) => categoryTypes.find((type) => type.value === row.original.type)?.text
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({row}) => <div className="rounded-full h-6 w-6" style={{
        backgroundColor: row.original.color
      }}></div>,
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <CategoriesTableActions handleDeleteCategory={handleDeleteCategory} handleUpdateCategory={handleUpdateCategory} row={row} />
    }
  ]


  return (
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}


interface CategoriesTableActionsProps {
  readonly row: Row<any>
  readonly handleDeleteCategory: ({
    categoryId
  }: {
    categoryId: number
  }) => void,
  readonly handleUpdateCategory: ({
    categoryId,
    props
  }: {
    categoryId: number,
    props: object
  }) => void
}

const CategoriesTableActions = ({ row, handleUpdateCategory, handleDeleteCategory }: CategoriesTableActionsProps) => {

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const updateCategoryForm = useForm<z.infer<typeof categoryForm>>({
    resolver: zodResolver(categoryForm),
    defaultValues: {
      name: row.original.name,
      color: row.original.color,
      type: row.original.type
    },
  })

  const onSubmit = async (values: z.infer<typeof categoryForm>) => {
    handleUpdateCategory({
      categoryId: row.original.id,
      props: values
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
            <AlertDialogTitle>Detalles de la categoría</AlertDialogTitle>
          </AlertDialogHeader>
          <Form {...updateCategoryForm}>
            <form onSubmit={updateCategoryForm.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <FormField
                control={updateCategoryForm.control}
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
                control={updateCategoryForm.control}
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
                control={updateCategoryForm.control}
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TrashIcon className="cursor-pointer h-4 w-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogContent>
            ¿Quieres continuar? Esta acción no se puede deshacer. Junto con la categoría se eliminarán todos sus gastos
          </AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteCategory({ categoryId: row.original.id })}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  )
}