"use client"
import EquityStatementForm from "@/app/ui/equity/equity-statement-form"
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import { EquityPerDate } from "@/types/api";
import { getEquityPerDate } from "@/lib/services/equityService";
import { toast } from "@/components/ui/use-toast";
import { TableSkeleton } from "@/app/ui/components/Skeletons";
import EquityStatementsTable from "@/app/ui/equity/equity-statements-table";
import moment from "moment";

export default function EquityPage() {

    const [userData, setUserData] = useState<Session | undefined>()
    const [displayForm, setDisplayForm] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [equityPerDate, setEquityPerDate] = useState<Array<EquityPerDate>>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())


    const fetchData = async () => {
        try {
            setIsLoading(true)
            const data = await getSession()
            if (data) {
                setUserData(data)
                const equityData = await getEquityPerDate(data.user.token)
                setEquityPerDate(equityData.data.map((e: EquityPerDate) => {
                    return {
                        ...e,
                        date: moment(e.date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                        totalEquity: e.totalEquity.toLocaleString('es-ES')
                    }
                }))
            }
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


    useEffect(() => {
        fetchData()
    }, [])

    const handleBackToTable = () => {
        setDisplayForm(false)
    }

    const handleDisplayForm = (date: Date) => {
        setSelectedDate(date)
        setDisplayForm(true)
    }

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Patrimonio</h1>
            {displayForm ? (<EquityStatementForm selectedDate={selectedDate} userData={userData} handleBackToTable={handleBackToTable} reload={fetchData} />) :
                (
                    <>
                        <section className="flex items-center justify-end mb-4">
                            <Button variant="outline" onClick={() => setDisplayForm(true)}>
                                Añadir registro
                            </Button>
                        </section>

                        {isLoading ? (
                            <div className="mx-auto py-10">
                                <TableSkeleton columns={['Fecha', 'Patrimonio', 'Acciones']} />
                            </div>
                        ) : (
                            <EquityStatementsTable handleDisplayForm={handleDisplayForm} data={equityPerDate} userData={userData} reload={fetchData} />
                        )}
                    </>


                )}
        </main>
    )
}