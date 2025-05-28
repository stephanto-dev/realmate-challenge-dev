import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatToBrazilianDateTimeWithFns = (dateString: string): string => {
  try {
    const date = parseISO(dateString); // Converte string ISO para objeto Date
    return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data com date-fns:", dateString, error);
    return "Erro na data";
  }
};