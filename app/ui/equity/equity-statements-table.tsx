import { EquityPerDate } from "@/types/api";
import { Session } from "next-auth";
import { DataTable } from "../components/datatable";
import { ColumnDef, Row } from "@tanstack/react-table";
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
import { PencilIcon } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  readonly data: EquityPerDate[];
  readonly userData: Session | undefined;
  readonly reload: () => void
}

export default function EquityStatementsTable({ data, userData, reload }: Props) {


  const { toast } = useToast()

  // @ts-ignore
  const handleUpdate = async ({
    date
  }: {
    date: string
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

    //

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
  const handleDelete = async ({
    date
  }: {
    date: string
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');

        //

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


  const columns: ColumnDef<EquityPerDate>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
    },
    {
      accessorKey: "totalEquity",
      header: "amount",
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <EquityStatementActions row={row} handleDelete={handleDelete} handleUpdate={handleUpdate} />
    }
  ]


  return (
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}


interface EquityStatementActionsProps {
    readonly row: Row<any>
    readonly handleDelete: ({
      date
    }: {
      date: string
    }) => void,
    readonly handleUpdate: ({
      date
    }: {
        date: string
    }) => void
  }
  
  const EquityStatementActions = ({ row, handleUpdate, handleDelete }: EquityStatementActionsProps) => {
  
    return (
      <div className="flex space-x-4">
        <PencilIcon onClick={() => handleUpdate(row.original.date)} className="cursor-pointer h-4 w-4 text-blue-500" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TrashIcon className="cursor-pointer h-4 w-4 text-red-500" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar registro de patrimonio</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogContent>
              ¿Quieres continuar? Esta acción no se puede deshacer. Se eliminarán todos los registros de esta fecha
            </AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete({ date: row.original.date })}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }