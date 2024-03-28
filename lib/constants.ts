import { z } from "zod"

export const MONTHS = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  
export const categoryTypes = [
  {
    value: 'EXPENSES',
    text: 'Gastos'
  },
  {
    value: 'EQUITY',
    text: 'Patrimonio'
  },
]

export const equityStatementTypes = [
  {
    value: 'ASSET',
    text: 'Activo'
  },
  {
    value: 'LIABILITY',
    text: 'Pasivo'
  },
]

export const equityStatementForm = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional(),
  categoryId: z.string(),
  amount: z.coerce.number().gt(0, 'El importe debe ser mayor a 0'),
  type: z.string(),
})
