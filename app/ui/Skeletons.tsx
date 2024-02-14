import { Skeleton } from "@/components/ui/skeleton"

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export function GroupCardSkeleton() {
    return(
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <StatCardSkeleton/>
            <StatCardSkeleton/>
            <StatCardSkeleton/>
        </div>
    )
}