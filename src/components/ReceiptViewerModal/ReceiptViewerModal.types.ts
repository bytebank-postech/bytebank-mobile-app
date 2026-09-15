import type { TransactionReceipt } from '@/shared/types/transaction'

export type ReceiptViewerModalProps = {
  isOpen: boolean
  transactionName: string
  receipts: TransactionReceipt[]
  onClose: () => void
}
