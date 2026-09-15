import type { CreateTransactionInput } from '@/services/transactions'
import type { Transaction } from '@/shared/types/transaction'

export type TransactionFormModalProps = {
  isOpen: boolean
  transaction?: Transaction | null
  onClose: () => void
  onSubmit: (input: CreateTransactionInput) => Promise<void>
}
