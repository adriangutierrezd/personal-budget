import CategoriesTable from "../ui/categories/CategoriesTable";
import NewCategoryDialog from "../ui/categories/new-category-dialog";
export default function CategoriesPage(){
    return(
        <main className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Categorías</h1>
            <section className="flex items-center justify-end mb-4">
                <NewCategoryDialog/>
            </section>
            <CategoriesTable/>
        </main>
    )
}