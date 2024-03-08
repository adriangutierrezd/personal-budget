import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hexToRgba(hex: string, alpha: number) {
  // Eliminar el "#" si lo hay
  hex = hex.replace("#", "");

  // Si el código es corto (3 caracteres), convertirlo a uno largo (6 caracteres)
  if (hex.length === 3) {
    hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
  }

  // Convertir el código HEX a valores RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Devolver el valor RGBA con la opacidad especificada
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


