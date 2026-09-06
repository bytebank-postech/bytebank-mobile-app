import type { TransactionType } from '@/types/transaction'

export interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  initial?: {
    id?: string
    type: TransactionType
    name: string
    amount: number
  }
  onSubmit: (payload: {
    id?: string
    type: TransactionType
    name: string
    amount: number
  }) => Promise<void>
}
