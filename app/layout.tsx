"use client"
import Link from "next/link";
import "./globals.css";
import { inter } from "./ui/fonts";
import { usePathname } from "next/navigation";
import { HomeIcon, DocumentPlusIcon, DocumentMinusIcon, FolderOpenIcon, ChartBarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const links = [
  {
    name: 'Inicio', 
    href: '/', 
    icon: HomeIcon
  },
  {
    name: 'Ingresos', 
    href: '/income', 
    icon:  DocumentPlusIcon
  },
  {
    name: 'Gastos', 
    href: '/expenses', 
    icon: DocumentMinusIcon
  },
  {
    name: 'Categorías', 
    href: '/categories', 
    icon: FolderOpenIcon
  },
  {
    name: 'Estadísticas', 
    href: '/statics', 
    icon: ChartBarIcon
  },
  {
    name: 'Gastos recurrentes', 
    href: '/recurring', 
    icon: ArrowPathIcon
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()


  return (
    <html lang="en">
      <body className={inter.className}>
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              {links.map(link => {
                const LinkIcon = link.icon
                return (
                  <Link 
                    href={link.href} 
                    key={link.href} 
                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${link.href === pathname ? 'bg-gray-200' : ''}`}>
                    <LinkIcon className="h-6 w-6" />
                    <span className="ms-3">{link.name}</span>
                  </Link>
                )
              })}
            </ul>
        </div>
      </aside>
        <div className="sm:ml-64">{children}</div>
      </body>
    </html>
  );
}
