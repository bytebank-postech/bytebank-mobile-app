import { z } from 'zod'

import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from '@/shared/types/transaction'
import { toISODate } from '@/shared/utils/date'

export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 60
export const MAX_AMOUNT = 999_999_999.99

export const parseAmount = (value: string): number | null => {
  const trimmed = value.trim()

  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

export const formatAmountInput = (amount: number) =>
  Math.abs(amount).toFixed(2).replace('.', ',')

const isValidISODate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T12:00:00`)

  return !Number.isNaN(date.getTime()) && toISODate(date) === value
}

const isNotInFuture = (value: string) => value <= toISODate(new Date())

const amountField = z
  .string()
  .trim()
  .min(1, 'Informe o valor.')
  .refine(
    (value) => parseAmount(value) !== null,
    'Valor inválido. Use no máximo duas casas decimais.'
  )
  .refine(
    (value) => (parseAmount(value) ?? 0) > 0,
    'O valor deve ser maior que zero.'
  )
  .refine(
    (value) => (parseAmount(value) ?? 0) <= MAX_AMOUNT,
    'O valor informado é alto demais.'
  )
  .transform((value) => parseAmount(value) as number)

export const transactionFormSchema = z
  .object({
    type: z.enum(TRANSACTION_TYPES, {
      error: 'Selecione o tipo da transação.',
    }),
    category: z.enum(TRANSACTION_CATEGORIES, {
      error: 'Selecione a categoria.',
    }),
    direction: z.enum(['in', 'out'], {
      error: 'Informe se é entrada ou saída.',
    }),
    name: z
      .string()
      .trim()
      .min(NAME_MIN_LENGTH, `A descrição precisa de ao menos ${NAME_MIN_LENGTH} caracteres.`)
      .max(NAME_MAX_LENGTH, `A descrição pode ter no máximo ${NAME_MAX_LENGTH} caracteres.`),
    amount: amountField,
    date: z
      .string()
      .min(1, 'Informe a data.')
      .refine(isValidISODate, 'Data inválida.')
      .refine(isNotInFuture, 'A data não pode estar no futuro.'),
  })
  .transform((values) => ({
    type: values.type,
    category: values.category,
    name: values.name,
    amount: values.direction === 'out' ? -values.amount : values.amount,
    date: values.date,
  }))

export type TransactionFormValues = {
  type: string
  category: string
  direction: 'in' | 'out'
  name: string
  amount: string
  date: string
}

export type TransactionFieldErrors = Partial<
  Record<keyof TransactionFormValues, string>
>

export type ValidationResult =
  | { success: true; data: z.output<typeof transactionFormSchema> }
  | { success: false; errors: TransactionFieldErrors }

export const validateTransactionForm = (
  values: TransactionFormValues
): ValidationResult => {
  const result = transactionFormSchema.safeParse(values)

  if (result.success) return { success: true, data: result.data }

  const errors: TransactionFieldErrors = {}

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof TransactionFormValues | undefined

    if (field && !errors[field]) errors[field] = issue.message
  }

  return { success: false, errors }
}
