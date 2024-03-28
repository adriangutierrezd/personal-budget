import { Category, EquityStatement } from "@/types/api";
import { Session } from "next-auth";
import { DataTable } from "../components/datatable";
import { ColumnDef, Row } from "@tanstack/react-table";
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
import EquityStatementDialog from "./equity-statement-dialog";

interface Props {
  readonly data: EquityStatement[];
  readonly userData: Session | undefined;
  readonly handleDelete: (id: number) => void;
  readonly date: Date;
  readonly categories: Category[];
  readonly handleStatementsChange: (action: "ADD" | "UPDATE", statement: EquityStatement) => void

}

export default function EquityStatementLineTable({ data, date, categories, handleStatementsChange, userData, handleDelete }: Props) {

  const columns: ColumnDef<EquityStatement>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
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
      cell: ({ row }) => <EquityStatementActions categories={categories} handleStatementsChange={handleStatementsChange} date={date} row={row} userData={userData} handleDelete={handleDelete}  />
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
    readonly handleDelete: (id: number) => void;
    readonly date: Date;
    readonly userData: Session | undefined;
    readonly categories: Category[];
    readonly handleStatementsChange: (action: "ADD" | "UPDATE", statement: EquityStatement) => void
  }
  
  const EquityStatementActions = ({ row, handleDelete, categories, userData, date, handleStatementsChange}: EquityStatementActionsProps) => {

    const defValues = {
      name: row.original.name ?? undefined,
      description: row.original.description ?? undefined,
      categoryId: row.original.categoryId ? row.original.categoryId.toString() : undefined,
      amount: row.original.amount ?? undefined,
      type: row.original.type ?? undefined,
    }
  
    return (
      <div className="flex space-x-4">
        <EquityStatementDialog handleStatementsChange={handleStatementsChange} id={row.original.id} categories={categories} defaultValues={defValues} userData={userData} date={date} trigger={<PencilIcon className="cursor-pointer h-4 w-4 text-blue-500" />} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TrashIcon className="cursor-pointer h-4 w-4 text-red-500" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar registro de patrimonio</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogContent>
              ¿Quieres continuar? Esta acción no se puede deshacer.
            </AlertDialogContent>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(row.original.id)}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }