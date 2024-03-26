
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

interface Props{
  readonly userData: Session|undefined;
  readonly reload: () => void;
  readonly handleBackToTable: () => void;
}

export default function EquityStatementForm({userData, reload, handleBackToTable}: Props) {

    return (
        <>
            <div className="flex items-center justify-end">
                <Button onClick={handleBackToTable} variant="outline">
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                </Button>
            </div>
            <h2>Activos</h2>


            <h2>Pasivos</h2>
        </>
    )

}