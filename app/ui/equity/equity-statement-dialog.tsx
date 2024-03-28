"use client"
import { Category, EquityStatement } from "@/types/api";
import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { equityStatementTypes, equityStatementForm } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Session } from "next-auth";
import { storeEquityStatement, updateEquityStatement } from "@/lib/services/equityService";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";


interface Props {
    readonly trigger: JSX.Element;
    readonly defaultValues: object;
    readonly categories: Category[];
    readonly userData: Session | undefined;
    readonly date: Date;
    readonly id: number | null;
    readonly handleStatementsChange: (action: "ADD" | "UPDATE", statement: EquityStatement) => void
}

export default function EquityStatementDialog({defaultValues, trigger, categories, date, handleStatementsChange, userData, id = null}: Props){

    const [open, setOpen] = useState<boolean>(false)

    const onSubmit = async (values: z.infer<typeof equityStatementForm>, id: number|null) => {
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
                    handleStatementsChange('ADD', newStatement)
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
                if(response.status === 200){
                    const data = await response.json()
                    const newStatement = {
                        ...data.data,
                        category: categories.find((category: Category) => category.id === Number(data.data.categoryId))
                    }
                    handleStatementsChange('UPDATE', newStatement)
                    setOpen(false)
                }  
            }

        }catch(error){
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
                variant: 'destructive'
            })
        }
    }

    const form = useForm<z.infer<typeof equityStatementForm>>({
        resolver: zodResolver(equityStatementForm),
        defaultValues,
    })

    const { reset } = form

    return (
        <AlertDialog open={open} onOpenChange={() => { reset({}) }}>
        {React.cloneElement(trigger, { onClick: () => setOpen(true) })}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Detalles del registro</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => onSubmit(form.getValues(), id))} className="space-y-4">
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
                                <FormLabel>Tipo *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo de registro" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {equityStatementTypes.map((type) => {
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
                        <AlertDialogCancel onClick={() => setOpen(false)} type="button" >Cancelar</AlertDialogCancel>
                        <Button type="submit">Guardar</Button>
                    </AlertDialogFooter>
                </form>
            </Form>
        </AlertDialogContent>
    </AlertDialog>
    )
}