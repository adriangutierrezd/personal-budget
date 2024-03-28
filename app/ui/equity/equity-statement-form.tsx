"use client"
import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { ArrowUturnLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Category, EquityStatement } from "@/types/api";
import { useEffect, useState } from "react";
import { destroyEquityStatement, getEquityStatements } from "@/lib/services/equityService";
import EquityStatementLineTable from "./equity-statement-line-table";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";
import { getCategories } from "@/lib/services/categoriesService";
import EquityStatementDialog from "./equity-statement-dialog";

interface Props {
    readonly userData: Session | undefined;
    readonly handleBackToTable: () => void;
    readonly reload: () => void;
    readonly selectedDate: Date;
}

export default function EquityStatementForm({ userData, handleBackToTable, reload, selectedDate = new Date() }: Props) {

    const [equityStatements, setEquityStatements] = useState<Array<EquityStatement>>([])
    const [assetStatements, setAssetStatements] = useState<Array<EquityStatement>>([])
    const [liabilityStatements, setLiabilityStatements] = useState<Array<EquityStatement>>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [date, setDate] = React.useState<Date>(selectedDate)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [equityData, categoriesData] = await Promise.all([
                getEquityStatements(userData?.user.token ?? '', moment(date).format('YYYY-MM-DD')),
                getCategories(userData?.user.token ?? '')
            ])
            setEquityStatements(equityData.data)
            setCategories(categoriesData.data.filter((category: Category) => category.type === 'EQUITY'))
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {

            const token = userData?.user.token
            if (!token) throw new Error('Ha ocurrido un error de autenticación')

            const response = await destroyEquityStatement({
                token,
                statementId: id
            })

            if(response.status === 200){
                setEquityStatements(equityStatements.filter((statement: EquityStatement) => statement.id != id))
            }

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
                variant: 'destructive'
            })
        }
    }

    const handleStatementsChange = (action: "ADD" | "UPDATE", statement: EquityStatement) => {
        if(action === 'ADD'){
            setEquityStatements([...equityStatements, statement])
        }else if(action === 'UPDATE'){
            const updatedStatements = equityStatements.map((item) => {
                if (item.id == statement.id) {
                    return statement;
                } else {
                    return item;
                }
            });
            setEquityStatements(updatedStatements);
        }

        reload()
    }

    useEffect(() => {
        fetchData()
    }, [date])

    useEffect(() => {
        setAssetStatements(equityStatements.filter((d: EquityStatement) => d.type === 'ASSET'))
        setLiabilityStatements(equityStatements.filter((d: EquityStatement) => d.type === 'LIABILITY'))
    }, [equityStatements])

    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarDaysIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            locale={es}
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleBackToTable} variant="outline">
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center justify-end mb-3">
                <EquityStatementDialog handleStatementsChange={handleStatementsChange} id={null} categories={categories} defaultValues={{}} userData={userData} date={date} trigger={<Button type="button">
                    Añadir registro
                </Button>} />
            </div>
            <h2 className="font-semibold">Activos</h2>
            {isLoading ? (<p>...</p>) : (<EquityStatementLineTable handleStatementsChange={handleStatementsChange} date={date} categories={categories} handleDelete={handleDelete} data={assetStatements} userData={userData} />)}

            <h2 className="font-semibold">Pasivos</h2>
            {isLoading ? (<p>...</p>) : (<EquityStatementLineTable handleStatementsChange={handleStatementsChange} date={date} categories={categories} handleDelete={handleDelete} data={liabilityStatements} userData={userData} />)}

        </>
    )

}