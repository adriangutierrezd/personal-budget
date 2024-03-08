"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, DocumentPlusIcon, DocumentMinusIcon, Bars3Icon, FolderOpenIcon, ChartBarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const links = [
  {
    name: 'Inicio', 
    href: '/dashboard/', 
    icon: HomeIcon
  },
  {
    name: 'Ingresos', 
    href: '/dashboard/income', 
    icon:  DocumentPlusIcon
  },
  {
    name: 'Gastos', 
    href: '/dashboard/expenses', 
    icon: DocumentMinusIcon
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
  // {
  //   name: 'Gastos recurrentes', 
  //   href: '/dashboard/recurring', 
  //   icon: ArrowPathIcon
  // },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? '-translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 bg-gray-50 dark:bg-gray-800 overflow-y-auto`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4">
          <ul className="space-y-2 font-medium">
            {links.map(link => {
              const LinkIcon = link.icon;
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                    link.href === pathname ? 'bg-gray-200' : ''
                  }`}
                >
                  <LinkIcon className="h-6 w-6" />
                  <span className="ms-3">{link.name}</span>
                </Link>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="flex items-center justify-end h-8 px-4 py-6 sm:ml-64">
        <button onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <main className="p-4 sm:pl-64">{children}</main>
    </>
  );
}
