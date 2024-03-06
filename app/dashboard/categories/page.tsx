"use client"
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Category } from "@/types/api";
import { Session } from "next-auth";
import CategoriesTable from "@/app/ui/categories/categories-table";
import NewCategoryDialog from "@/app/ui/categories/new-category-dialog";
import { getCategories } from "@/lib/services/categoriesService";


export default function CategoriesPage(){


  const [userData, setUserData] = useState<Session|undefined>()
  const [categories, setCategories] = useState<Array<Category>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)


  const fetchData = async () => {
    setIsLoading(true)

    const data = await getSession()

    if (data) {
      setUserData(data)
      const categoriesData = await getCategories(data.user.token)
      setCategories(categoriesData.data)
    }

    setIsLoading(false)
  }


  useEffect(() => {
    fetchData()
  }, [])


    return(
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Categorías</h1>
            <section className="flex items-center justify-end mb-4">
                <NewCategoryDialog reload={fetchData} userData={userData}/>
            </section>
            <CategoriesTable data={categories} userData={userData} reload={fetchData}/>
        </main>
    )
}