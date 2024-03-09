import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-6">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Aplicación de gastos personales</h1>
      </section>
      <div className="flex flex-col items-center space-y-3">
        <Button asChild>
          <a href="/login" className="">Iniciar sesión</a>
        </Button>
        <Button asChild>
          <a href="/register" className="">Crear cuenta</a>
        </Button>
      </div>
    </main>
  );
}
