import {
  TRANSACTION_TYPES,
  type Transaction,
  type TransactionType,
} from '@/shared/types/transaction'
import { toISODate } from '@/shared/utils/date'

export const SUMMARY_MONTHS = 6

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

export type MonthlyTotals = {
  key: string
  label: string
  income: number
  expenses: number
}

export type TypeTotal = {
  type: TransactionType
  total: number
}

export type TransactionSummary = {
  balance: number
  income: number
  expenses: number
  monthly: MonthlyTotals[]
  byType: TypeTotal[]
}

const toMonthKey = (date: string) => date.slice(0, 7)

export const getSummaryStartDate = (reference: Date) => {
  const firstMonth = reference.getMonth() - (SUMMARY_MONTHS - 1)

  return toISODate(new Date(reference.getFullYear(), firstMonth, 1))
}

const buildMonthlyTotals = (reference: Date): MonthlyTotals[] => {
  const months: MonthlyTotals[] = []

  for (let offset = SUMMARY_MONTHS - 1; offset >= 0; offset -= 1) {
    const month = new Date(
      reference.getFullYear(),
      reference.getMonth() - offset,
      1
    )

    months.push({
      key: toMonthKey(toISODate(month)),
      label: MONTH_LABELS[month.getMonth()],
      income: 0,
      expenses: 0,
    })
  }

  return months
}

const buildTypeTotals = (transactions: Transaction[]): TypeTotal[] =>
  TRANSACTION_TYPES.map((type) => ({
    type,
    total: transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0),
  }))

export const buildTransactionSummary = (
  transactions: Transaction[],
  reference: Date = new Date()
): TransactionSummary => {
  const monthly = buildMonthlyTotals(reference)
  const monthsByKey = new Map(monthly.map((month) => [month.key, month]))

  let income = 0
  let expenses = 0

  for (const transaction of transactions) {
    const month = monthsByKey.get(toMonthKey(transaction.date))

    if (transaction.amount >= 0) {
      income += transaction.amount

      if (month) month.income += transaction.amount

      continue
    }

    const value = Math.abs(transaction.amount)

    expenses += value

    if (month) month.expenses += value
  }

  return {
    balance: income - expenses,
    income,
    expenses,
    monthly,
    byType: buildTypeTotals(transactions),
  }
}
