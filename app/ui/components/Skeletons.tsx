import { Skeleton } from "@/components/ui/skeleton";

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton({
  columns,
}: {
  readonly columns: Array<string>;
}) {
  return (
    <table className="hidden min-w-full text-gray-900 md:table">
    <thead className="rounded-lg border text-left text-sm font-normal">
      <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
        {columns.map((column: string) => {
          return (
            <th
              key={column}
              scope="col"
              className="h-10 px-2 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-slate-400"
            >
              {column}
            </th>
          );
        })}
      </tr>
    </thead>
    <tbody className="bg-white">
      <TableRowSkeleton />
    </tbody>
  </table>
  );
}

export function FormSkeleton({
  rows,
  className,
}: {
  readonly rows: number[][];
  readonly className?: string;
}) {
  return (
    <div className={`grid grid-cols-12 gap-4 ${className ?? ""}`}>
      {rows.flatMap((row, rowIndex) =>
        row.map((colSpan, colIndex) => (
          <div
            key={`col-${colIndex + 1}-row-${rowIndex + 1}`}
            className={`col-span-${colSpan}`}
          >
            <Skeleton className="h-3 mb-2 w-[100px]" />
            <Skeleton className="h-6 block" />
          </div>
        ))
      )}
    </div>
  );
}

export const DashboardCard = () => {
  return (
    <Skeleton className="h-[100px] rounded-xl">
      <div className="p-2">
        <Skeleton className="h-4 mb-4 w-[100px]" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[70px]" />
          <Skeleton className="h-4 w-[20px]" />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-t-lg rounded-b-lg p-2">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[30px]" />
      </div>
    </Skeleton>
  );
};
