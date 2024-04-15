"use client"
import { Button } from "@/components/ui/button";
import { poppins } from "./ui/fonts";
import Link from "next/link"
import { FolderOpen, LineChart, Menu, CheckCircle, PieChart, RefreshCcw, Wallet } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <header className={`${poppins.className} sticky top-0 flex bg-white h-16 items-center gap-4 border-b bg-background px-4 md:px-6`}>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Wallet className="h-6 w-6" />

            <span className="sr-only">Finanzas personales</span>
          </Link>
          <Link
            href="#features"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Ventajas
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>
        <Sheet open={open} onOpenChange={() => setOpen(!open)}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Wallet className="h-6 w-6" />
                <span className="sr-only">Finanzas personales</span>
              </Link>
              <Link
                onClick={() => setOpen(false)}
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                Ventajas
              </Link>
              <Link
                onClick={() => setOpen(false)}
                href="#faq"
                className="text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button variant="secondary" asChild className="rounded-full">
            <Link href="/login">
              Iniciar sesión
            </Link>
          </Button>
          <Button className="rounded-full">
            <Link href="/register">
              Crear cuenta
            </Link>
          </Button>
        </div>
      </header>
      <main className={`${poppins.className} mx-auto max-w-7xl`}>

        <section className="bg-white dark:bg-gray-900">


          <div className="container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
            <div className="w-full lg:w-1/2">
              <div className="lg:max-w-lg">
                <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
                  Controla tus finanzas personales de forma sencilla
                </h1>

                <div className="mt-8 space-y-5">
                  <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                    <CheckCircle className="w-6 h-6 mx-2 text-blue-500" />
                    <span className="mx-2">Obtén una visión clara de tus finanzas</span>
                  </p>

                  <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                    <CheckCircle className="w-6 h-6 mx-2 text-blue-500" />
                    <span className="mx-2">Consigue tus objetivos de ahorro</span>
                  </p>

                  <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                    <CheckCircle className="w-6 h-6 mx-2 text-blue-500" />
                    <span className="mx-2">Mejora tus hábitos de gasto</span>
                  </p>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
              <Image src={`/finances.svg`} alt="test" width="500" height="500" className="flex-shrink-0 object-cover" />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900" id="features">
          <div className="container px-6 py-10 mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 lg:text-3xl dark:text-white">No pierdas detalle  <br /> de lo que ocurre en tu bolsillo</h2>

            <div className="mt-2">
              <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
              <span className="inline-block w-3 h-1 ml-1 bg-blue-500 rounded-full"></span>
              <span className="inline-block w-1 h-1 ml-1 bg-blue-500 rounded-full"></span>
            </div>

            <div className="mt-8 xl:mt-12 lg:flex lg:items-center">
              <div className="grid w-full grid-cols-1 gap-8 lg:w-1/2 xl:gap-16 md:grid-cols-2">
                <div className="space-y-3">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-xl dark:text-white dark:bg-blue-500">
                    <LineChart className="h-6 w-6" />
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 dark:text-white">Sigue tu progreso</h1>

                  <p className="text-gray-500 dark:text-gray-300">
                    Comprueba cómo evolucionan tus ingresos y tus gastos de forma mensual
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-xl dark:text-white dark:bg-blue-500">
                    <PieChart className="h-6 w-6" />
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 dark:text-white">Analiza tu patrimonio</h1>

                  <p className="text-gray-500 dark:text-gray-300">
                    Registra tus activos y pasivos en cualquier momento para dejar constancia de tu patrimonio neto
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-xl dark:text-white dark:bg-blue-500">
                    <FolderOpen className="h-6 w-6" />
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 dark:text-white">Organiza tus gastos</h1>

                  <p className="text-gray-500 dark:text-gray-300">
                    Distribuye tus gastos en categorías para una mayor claridad en tus análisis
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-xl dark:text-white dark:bg-blue-500">
                    <RefreshCcw className="h-6 w-6" />

                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 dark:text-white">Añade gastos recurrentes</h1>

                  <p className="text-gray-500 dark:text-gray-300">
                    Indica cuáles son tus gasto fijos y nosotros los añadiremos por ti todos los meses
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex lg:w-1/2 lg:justify-center">
                <Image src={`/pay-online.svg`} alt="test" width="300" height="300" className="flex-shrink-0 object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900" id="faq">
          <h2 className="text-2xl font-semibold text-center text-gray-800 lg:text-3xl dark:text-white">Preguntas frecuentes</h2>

          <div className="my-12">

            <Accordion className="space-y-8" type="single" collapsible>
              <AccordionItem className="border-2 border-gray-100 rounded-lg dark:border-gray-700" value="item-1">
                <AccordionTrigger className="flex items-center justify-between w-full p-8">
                  <h3 className="font-semibold text-gray-700 dark:text-white">¿Necesito conectar mi banco?</h3>
                </AccordionTrigger>
                <AccordionContent className="px-8 text-sm text-gray-500 dark:text-gray-300">
                  No. No es necesario hacer ningún tipo de conexión con tu banco u otras cuentas de pagos como Paypal.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem className="border-2 border-gray-100 rounded-lg dark:border-gray-700" value="item-2">
                <AccordionTrigger className="flex items-center justify-between w-full p-8">
                  <h3 className="font-semibold text-gray-700 dark:text-white">¿Puedo añadir varias fuentes de ingresos?</h3>
                </AccordionTrigger>
                <AccordionContent className="px-8 text-sm text-gray-500 dark:text-gray-300">
                  Sí. No hay un límite ni en el número de gastos que puedes añadir ni en el número de ingresos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem className="border-2 border-gray-100 rounded-lg dark:border-gray-700" value="item-3">
                <AccordionTrigger className="flex items-center justify-between w-full p-8">
                  <h3 className="font-semibold text-gray-700 dark:text-white">¿Los gastos recurrentes se pueden modificar?</h3>
                </AccordionTrigger>
                <AccordionContent className="px-8 text-sm text-gray-500 dark:text-gray-300">
                  Sí. Estos gastos funcionan como un gasto normal y corriente, se pueden modificar y estas modificaciones no son retroactivas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem className="border-2 border-gray-100 rounded-lg dark:border-gray-700" value="item-4">
                <AccordionTrigger className="flex items-center justify-between w-full p-8">
                  <h3 className="font-semibold text-gray-700 dark:text-white">¿Cuando se aplican los gatos recurrentes?</h3>
                </AccordionTrigger>
                <AccordionContent className="px-8 text-sm text-gray-500 dark:text-gray-300">
                  Los gastos recurrentes se aplican durante la madrugada del día 1 de cada mes
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">

          <p className="text-sm text-gray-600 dark:text-gray-300">Desarrollado por <a href="https://adriangutierrezd.com" className="hover:underline">Adrián Gutiérrez</a></p>

          <div className="flex -mx-2">
            <a href="https://twitter.com/agutierrezd_" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Reddit">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>


            <a href="https://github.com/adriangutierrezd" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Github">

              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

