"use client"
import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { ArrowUturnLeftIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Category, EquityStatement } from "@/types/api";
import { useEffect, useState } from "react";
import { getEquityStatements } from "@/lib/services/equityService";
import EquityStatementLineTable from "./equity-statement-line-table";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { categoryTypes } from "@/lib/constants";
import { getCategories } from "@/lib/services/categoriesService";

const formSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(255).optional(),
    date: z.date(),
    categoryId: z.string(),
    amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0'),
    type: z.string(),
})


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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [equityData, categoriesData] = await Promise.all([
                getEquityStatements(userData?.user.token ?? '', moment(date).format('YYYY-MM-DD')),
                getCategories(userData?.user.token ?? '')
            ])
            setEquityStatements(equityData.data)
            setAssetStatements(equityData.data.filter((d: EquityStatement) => d.type === 'ASSET'))
            setLiabilityStatements(equityData.data.filter((d: EquityStatement) => d.type === 'LIABILITY'))
            setCategories(categoriesData.data)
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {


    }

    useEffect(() => {
        fetchData()
    }, [date])

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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">
                            Añadir registro
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Detalles del registro</AlertDialogTitle>
                        </AlertDialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
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
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de registro" />
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
                                    control={form.control}
                                    name="categoryId"
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
                                                    {categories.map((category) => {
                                                        return (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
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
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Importe *</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <AlertDialogFooter className="col-span-2">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                    <Button type="submit">Guardar</Button>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <h2 className="font-semibold">Activos</h2>
            <>
                {isLoading ? (<p>...</p>) : (<EquityStatementLineTable data={assetStatements} userData={userData} />)}
            </>


            <h2 className="font-semibold">Pasivos</h2>
            {isLoading ? (<p>...</p>) : (<EquityStatementLineTable data={liabilityStatements} userData={userData} />)}

        </>
    )

}