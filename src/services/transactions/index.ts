import { firebaseTransactionService } from './firebase-transaction-service'
import type { TransactionService } from './transaction-service.types'

export const transactionService: TransactionService = firebaseTransactionService

export {
  DEFAULT_PAGE_SIZE,
  TransactionNotFoundError,
  type CreateTransactionInput,
  type ListTransactionsParams,
  type ListTransactionsResult,
  type TransactionFilters,
  type TransactionService,
  type UpdateTransactionInput,
} from './transaction-service.types'
