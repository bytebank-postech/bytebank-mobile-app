import type {
  Transaction,
  TransactionCategory,
  TransactionReceipt,
  TransactionType,
} from '@/shared/types/transaction'

export const DEFAULT_PAGE_SIZE = 5

export type CreateTransactionInput = {
  type: TransactionType
  category: TransactionCategory
  name: string
  amount: number
  date: string
  receipts?: TransactionReceipt[]
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

export type TransactionFilters = {
  category?: TransactionCategory
  from?: string
  to?: string
  search?: string
}

export type ListTransactionsParams = {
  userId: string
  filters?: TransactionFilters
  limit?: number
  cursor?: string | null
}

export type ListTransactionsResult = {
  items: Transaction[]
  nextCursor: string | null
}

export interface TransactionService {
  list(params: ListTransactionsParams): Promise<ListTransactionsResult>
  create(
    userId: string,
    input: CreateTransactionInput
  ): Promise<Transaction>
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>
  remove(id: string): Promise<void>
}

export class TransactionNotFoundError extends Error {
  constructor(id: string) {
    super(`Transação não encontrada: ${id}`)
    this.name = 'TransactionNotFoundError'
  }
}
