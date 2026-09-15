import type { Transaction } from '@/shared/types/transaction'

import {
  DEFAULT_PAGE_SIZE,
  TransactionNotFoundError,
  type CreateTransactionInput,
  type ListSinceParams,
  type ListTransactionsParams,
  type ListTransactionsResult,
  type TransactionFilters,
  type TransactionService,
  type UpdateTransactionInput,
} from './transaction-service.types'

const NETWORK_DELAY_MS = 600

const cloneTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  receipts: transaction.receipts.map((receipt) => ({ ...receipt })),
})

let store: Transaction[] = []

let idCounter = 0

const nextId = () => {
  idCounter += 1
  return `mock-${idCounter}`
}

const simulateRequest = () =>
  new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

type OrderKey = {
  name: string
  date: string
  createdAt: string
  id: string
}

const toOrderKey = (transaction: Transaction): OrderKey => ({
  name: transaction.name.toLowerCase(),
  date: transaction.date,
  createdAt: transaction.createdAt,
  id: transaction.id,
})

const ascending = (a: string, b: string) => (a === b ? 0 : a < b ? -1 : 1)
const descending = (a: string, b: string) => (a === b ? 0 : a < b ? 1 : -1)

// O Firestore exige que a primeira ordenação seja no campo do filtro de
// faixa, então a busca por prefixo ordena por nome, não por data.
const compareInListOrder = (a: OrderKey, b: OrderKey, isSearching: boolean) => {
  if (isSearching) {
    const byName = ascending(a.name, b.name)

    if (byName !== 0) return byName
  }

  return (
    descending(a.date, b.date) ||
    descending(a.createdAt, b.createdAt) ||
    descending(a.id, b.id)
  )
}

const encodeCursor = (key: OrderKey) => JSON.stringify(key)

const decodeCursor = (cursor: string): OrderKey | null => {
  try {
    const parsed: unknown = JSON.parse(cursor)

    if (parsed && typeof parsed === 'object' && 'id' in parsed) {
      return parsed as OrderKey
    }

    return null
  } catch {
    return null
  }
}

const matchesFilters = (
  transaction: Transaction,
  filters: TransactionFilters = {}
) => {
  const { category, from, to, search } = filters

  if (category && transaction.category !== category) return false

  if (from && transaction.date < from) return false
  if (to && transaction.date > to) return false

  if (search) {
    const term = search.trim().toLowerCase()

    if (term && !transaction.name.toLowerCase().startsWith(term)) return false
  }

  return true
}

const list = async ({
  userId,
  filters,
  limit = DEFAULT_PAGE_SIZE,
  cursor = null,
}: ListTransactionsParams): Promise<ListTransactionsResult> => {
  await simulateRequest()

  const isSearching = Boolean(filters?.search?.trim())

  const ordered = store
    .filter(
      (transaction) =>
        transaction.userId === userId && matchesFilters(transaction, filters)
    )
    .sort((a, b) =>
      compareInListOrder(toOrderKey(a), toOrderKey(b), isSearching)
    )

  const after = cursor ? decodeCursor(cursor) : null

  const remaining = after
    ? ordered.filter(
        (transaction) =>
          compareInListOrder(toOrderKey(transaction), after, isSearching) > 0
      )
    : ordered

  const items = remaining.slice(0, limit)
  const lastItem = items[items.length - 1]

  return {
    items: items.map(cloneTransaction),
    nextCursor:
      remaining.length > items.length && lastItem
        ? encodeCursor(toOrderKey(lastItem))
        : null,
  }
}

const listSince = async ({
  userId,
  from,
}: ListSinceParams): Promise<Transaction[]> => {
  await simulateRequest()

  return store
    .filter(
      (transaction) => transaction.userId === userId && transaction.date >= from
    )
    .sort((a, b) => descending(a.date, b.date))
    .map(cloneTransaction)
}

const create = async (
  userId: string,
  input: CreateTransactionInput
): Promise<Transaction> => {
  await simulateRequest()

  const created: Transaction = {
    ...input,
    id: nextId(),
    userId,
    receipts: input.receipts ?? [],
    createdAt: new Date().toISOString(),
  }

  store = [created, ...store]

  return cloneTransaction(created)
}

const update = async (
  id: string,
  input: UpdateTransactionInput
): Promise<Transaction> => {
  await simulateRequest()

  const current = store.find((transaction) => transaction.id === id)

  if (!current) throw new TransactionNotFoundError(id)

  const updated: Transaction = {
    ...current,
    ...input,
    receipts: input.receipts ?? current.receipts,
  }

  store = store.map((transaction) =>
    transaction.id === id ? updated : transaction
  )

  return cloneTransaction(updated)
}

const remove = async (id: string): Promise<void> => {
  await simulateRequest()

  const exists = store.some((transaction) => transaction.id === id)

  if (!exists) throw new TransactionNotFoundError(id)

  store = store.filter((transaction) => transaction.id !== id)
}

export const mockTransactionService: TransactionService = {
  list,
  listSince,
  create,
  update,
  remove,
}
