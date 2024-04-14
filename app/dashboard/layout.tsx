"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUser,
  Menu,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HomeIcon, DocumentPlusIcon, DocumentMinusIcon, FolderOpenIcon, ChartBarIcon, ArrowPathIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signOut } from "next-auth/react";


const links = [
  {
    name: 'Inicio',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Ingresos',
    href: '/dashboard/income',
    icon: DocumentPlusIcon
  },
  {
    name: 'Gastos',
    href: '/dashboard/expenses',
    icon: DocumentMinusIcon
  },
  {
    name: 'Patrimonio',
    href: '/dashboard/equity',
    icon: CircleStackIcon
  },
  {
    name: 'Categorías',
    href: '/dashboard/categories',
    icon: FolderOpenIcon
  },
  {
    name: 'Estadísticas',
    href: '/dashboard/statics',
    icon: ChartBarIcon
  },
  {
    name: 'Gastos recurrentes',
    href: '/dashboard/recurring',
    icon: ArrowPathIcon
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Wallet className="h-6 w-6" />
              Finanzas personales
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {links.map(link => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === link.href ? 'bg-gray-100 text-muted' : 'text-muted-foreground  hover:text-primary'}`}
                  >
                    <LinkIcon className="h-5 w-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between md:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={open} onOpenChange={() => { setOpen(!open) }}>
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
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Wallet className="h-6 w-6" />
                </Link>
                {links.map(link => {
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      onClick={() => {
                        setOpen(false)
                      }}
                      href={link.href}
                      key={link.href}
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === link.href ? 'text-muted bg-gray-100' : 'text-muted-foreground hover:text-foreground'} `}
                    >
                      <LinkIcon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  );
                })}

              </nav>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
