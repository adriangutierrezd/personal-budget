import { EquityPerDate, EquityStatement } from "@/types/api";
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
import moment from "moment";
import { destroyEquityStatement, getEquityStatements } from "@/lib/services/equityService";

interface Props {
  readonly data: EquityPerDate[];
  readonly userData: Session | undefined;
  readonly reload: () => void
  readonly handleDisplayForm: (date: Date) => void
}

export default function EquityStatementsTable({ data, userData, reload, handleDisplayForm }: Props) {


  const { toast } = useToast()


  // @ts-ignore
  const handleDelete = async ({
    date
  }: {
    date: string
  }) => {
    try {

      if (!userData) throw new Error('Ha ocurrido un error de autenticación');
      const dateFormatted = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')

      const statementsResponse = await getEquityStatements(
        userData.user.token,
        dateFormatted
      )

      if(statementsResponse.data.length > 0){
        statementsResponse.data.forEach((statement: EquityStatement) => {
          destroyEquityStatement({
            token: userData.user.token,
            statementId: statement.id
          })
        })
      }

      toast({
        title: "Correcto",
        description: "Datos eliminados con éxito",
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
      header: "Cantidad",
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <EquityStatementActions row={row} handleDelete={handleDelete} handleDisplayForm={handleDisplayForm} />
    }
  ]


  return (
    <DataTable columns={columns} data={data} />
  )
}


interface EquityStatementActionsProps {
    readonly row: Row<any>
    readonly handleDelete: ({
      date
    }: {
      date: string
    }) => void,
    readonly handleDisplayForm: (date: Date) => void
  }
  
  const EquityStatementActions = ({ row, handleDisplayForm, handleDelete }: EquityStatementActionsProps) => {
  
    return (
      <div className="flex space-x-4">
        <PencilIcon onClick={() => handleDisplayForm(moment(row.original.date, 'DD-MM-YYYY').toDate())} className="cursor-pointer h-4 w-4 text-blue-500" />
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