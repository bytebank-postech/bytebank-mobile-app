export type TransactionType = 'Transferência' | 'Pix' | 'Depósito' | 'Pagamento'

export type TransactionCategory =
  | 'Moradia'
  | 'Alimentação'
  | 'Transporte'
  | 'Saúde'
  | 'Lazer'
  | 'Educação'
  | 'Salário'
  | 'Transferências'
  | 'Outros'

export type TransactionAttachment = {
  id: string
  name: string
  mimeType: string
  size: number
  url: string
}

export interface Transaction {
  id: string
  type: TransactionType
  name: string
  amount: number
  date: string
  category?: TransactionCategory
  attachments?: TransactionAttachment[]
}
