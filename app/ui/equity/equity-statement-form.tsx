"use client"
import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { z } from "zod"
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
import { destroyEquityStatement, getEquityStatements, storeEquityStatement, updateEquityStatement } from "@/lib/services/equityService";
import EquityStatementLineTable from "./equity-statement-line-table";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";
import { equityStatementForm } from "@/lib/constants";
import { getCategories } from "@/lib/services/categoriesService";
import EquityStatementDialog from "./equity-statement-dialog";

interface Props {
    readonly userData: Session | undefined;
    readonly reload: () => void;
    readonly handleBackToTable: () => void;
}

export default function EquityStatementForm({ userData, reload, handleBackToTable }: Props) {

    const [equityStatements, setEquityStatements] = useState<Array<EquityStatement>>([])
    const [assetStatements, setAssetStatements] = useState<Array<EquityStatement>>([])
    const [liabilityStatements, setLiabilityStatements] = useState<Array<EquityStatement>>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [date, setDate] = React.useState<Date>(new Date())


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

    const onSubmit = async (values: z.infer<typeof equityStatementForm>, id?: number) => {
        try{

            const token = userData?.user.token
            if(!token) throw new Error('Ha ocurrido un error de autenticación')

            if(!id){
                const response = await storeEquityStatement({
                    token,
                    props: {
                        ...values,
                        description: values.description ?? null,
                        date: moment(date).format('YYYY-MM-DD')
                    }
                })
    
                if(response.status === 201){
                    const data = await response.json()
                    const newStatement = {
                        ...data.data,
                        category: categories.find((category: Category) => category.id === Number(data.data.categoryId))
                    }
                    setEquityStatements([...equityStatements, newStatement])
                    setOpen(false)
                }
            }else{
                const response = await updateEquityStatement({
                    token,
                    statementId: id,
                    props: {
                        ...values,
                        description: values.description ?? null,
                        date: moment(date).format('YYYY-MM-DD')
                    }
                })
                console.log(response)    
            }

        }catch(error){
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            })
        }
    }

    const handleDelete = async (id: number) => {
        try{

            const token = userData?.user.token
            if(!token) throw new Error('Ha ocurrido un error de autenticación')

            await destroyEquityStatement({
                token,
                statementId: id
            })
        }catch(error){
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            })
        }
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
                <EquityStatementDialog id={null} categories={categories} defaultValues={{}} userData={userData} date={date} trigger={<></>} />
            </div>
            <h2 className="font-semibold">Activos</h2>
            {isLoading ? (<p>...</p>) : (<EquityStatementLineTable date={date} categories={categories} handleDelete={handleDelete} data={assetStatements} userData={userData} />)}

            <h2 className="font-semibold">Pasivos</h2>
            {isLoading ? (<p>...</p>) : (<EquityStatementLineTable date={date} categories={categories} handleDelete={handleDelete} data={liabilityStatements} userData={userData} />)}

        </>
    )

}