import type { TransactionReceipt } from '@/shared/types/transaction'

export type ReceiptsFieldProps = {
  receipts: TransactionReceipt[]
  isDisabled: boolean
  onAdd: (receipt: TransactionReceipt) => void
  onRemove: (receipt: TransactionReceipt) => void
}
