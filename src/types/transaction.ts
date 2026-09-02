export type TransactionType = 'Transferência' | 'Pix' | 'Depósito' | 'Pagamento'

export interface Transaction {
  id: string
  type: TransactionType
  name: string
  amount: number
  date: string
}
