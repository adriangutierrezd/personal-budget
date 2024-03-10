"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyEuroIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/outline";

interface Props {
    readonly totalRevenue: number,
    readonly totalExpense: number,
    readonly totalSaved: number
}

export default function StatsCards({totalSaved, totalExpense, totalRevenue}: Props) {

    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 mb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ingresos totales
                    </CardTitle>
                    <CurrencyEuroIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRevenue.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p> */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gatos</CardTitle>
                    <CreditCardIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalExpense.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p> */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ahorro neto
                    </CardTitle>
                    <WalletIcon className="h-5 w-5" stroke="currentColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSaved.toLocaleString('es-ES')} €</div>
                    {/* <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p> */}
                </CardContent>
            </Card>
        </div>
    )
}