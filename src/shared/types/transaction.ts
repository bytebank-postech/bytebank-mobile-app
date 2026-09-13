export const TRANSACTION_TYPES = [
  'Depósito',
  'Pix',
  'Transferência',
  'Pagamento',
] as const

export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const TRANSACTION_CATEGORIES = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Educação',
  'Salário',
  'Outros',
] as const

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

export type TransactionReceipt = {
  id: string
  name: string
  mimeType: string
  size: number
  storagePath: string
  downloadURL: string
}

export type PickedReceiptFile = {
  uri: string
  name: string
  mimeType: string
  size: number
}

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  category: TransactionCategory
  name: string
  amount: number
  date: string
  receipts: TransactionReceipt[]
  createdAt: string
}
