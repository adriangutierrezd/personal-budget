import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewExpenseDialog() {
    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Añade un gasto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añade un gasto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input id="name" placeholder="Comida..." className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Input id="color" type="color" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
}