import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit as limitQuery,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'

import { db } from '@/services/firebase'
import type {
  Transaction,
  TransactionCategory,
  TransactionReceipt,
  TransactionType,
} from '@/shared/types/transaction'

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

const COLLECTION = 'transactions'

const PREFIX_END = '\uf8ff'

const FALLBACK_ERROR = 'Não foi possível concluir a operação. Tente novamente.'

const INDEX_ERROR =
  'Não foi possível aplicar esses filtros agora. Tente novamente em instantes.'

type RuleType = 'Debit' | 'Credit'

type TransactionDocument = {
  userId: string
  accountId: string
  type: RuleType
  transactionType: TransactionType
  category: TransactionCategory
  name: string
  nameLowercase: string
  amount: number
  value: number
  date: string
  receipts: TransactionReceipt[]
  createdAt: string
  from: string
  to: string
}

type OrderKey = {
  name: string
  date: string
  createdAt: string
  id: string
}

const toRuleType = (amount: number): RuleType =>
  amount < 0 ? 'Debit' : 'Credit'

const toDocument = (
  transaction: Omit<Transaction, 'id'>
): TransactionDocument => ({
  userId: transaction.userId,
  accountId: transaction.userId,
  type: toRuleType(transaction.amount),
  transactionType: transaction.type,
  category: transaction.category,
  name: transaction.name,
  nameLowercase: transaction.name.toLowerCase(),
  amount: transaction.amount,
  value: Math.abs(transaction.amount),
  date: transaction.date,
  receipts: transaction.receipts,
  createdAt: transaction.createdAt,
  from: '',
  to: '',
})

const toTransaction = (snapshot: DocumentSnapshot): Transaction => {
  const data = snapshot.data() as TransactionDocument

  return {
    id: snapshot.id,
    userId: data.userId,
    type: data.transactionType,
    category: data.category,
    name: data.name,
    amount: data.amount,
    date: data.date,
    receipts: data.receipts ?? [],
    createdAt: data.createdAt,
  }
}

const toOrderKey = (transaction: Transaction): OrderKey => ({
  name: transaction.name.toLowerCase(),
  date: transaction.date,
  createdAt: transaction.createdAt,
  id: transaction.id,
})

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

const buildFilterConstraints = (
  userId: string,
  filters: TransactionFilters,
  term: string
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)]

  if (filters.category) {
    constraints.push(where('category', '==', filters.category))
  }

  if (filters.from) constraints.push(where('date', '>=', filters.from))
  if (filters.to) constraints.push(where('date', '<=', filters.to))

  if (term) {
    constraints.push(where('nameLowercase', '>=', term))
    constraints.push(where('nameLowercase', '<=', `${term}${PREFIX_END}`))
  }

  return constraints
}

// O Firestore exige que a primeira ordenação seja no campo do filtro de
// faixa, então a busca por prefixo ordena por nome, não por data.
const buildOrderConstraints = (isSearching: boolean): QueryConstraint[] => {
  const constraints: QueryConstraint[] = []

  if (isSearching) constraints.push(orderBy('nameLowercase', 'asc'))

  constraints.push(orderBy('date', 'desc'))
  constraints.push(orderBy('createdAt', 'desc'))
  constraints.push(orderBy(documentId(), 'desc'))

  return constraints
}

const toCursorValues = (key: OrderKey, isSearching: boolean) =>
  isSearching
    ? [key.name, key.date, key.createdAt, key.id]
    : [key.date, key.createdAt, key.id]

const getErrorCode = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  typeof error.code === 'string'
    ? error.code
    : null

const toFriendlyError = (error: unknown): Error => {
  if (error instanceof TransactionNotFoundError) return error

  switch (getErrorCode(error)) {
    case 'permission-denied':
      return new Error('Você não tem permissão para esta operação.')
    case 'unavailable':
      return new Error('Sem conexão com o servidor. Tente novamente.')
    case 'failed-precondition':
      // Em dev, a mensagem original traz o link de criação do índice.
      if (__DEV__ && error instanceof Error) console.warn(error.message)

      return new Error(INDEX_ERROR)
    default:
      return new Error(FALLBACK_ERROR)
  }
}

const list = async ({
  userId,
  filters = {},
  limit = DEFAULT_PAGE_SIZE,
  cursor = null,
}: ListTransactionsParams): Promise<ListTransactionsResult> => {
  const term = filters.search?.trim().toLowerCase() ?? ''
  const isSearching = Boolean(term)

  const constraints = [
    ...buildFilterConstraints(userId, filters, term),
    ...buildOrderConstraints(isSearching),
  ]

  const after = cursor ? decodeCursor(cursor) : null

  if (after) constraints.push(startAfter(...toCursorValues(after, isSearching)))

  constraints.push(limitQuery(limit + 1))

  try {
    const snapshot = await getDocs(
      query(collection(db, COLLECTION), ...constraints)
    )

    const found = snapshot.docs.map(toTransaction)
    const items = found.slice(0, limit)
    const lastItem = items[items.length - 1]

    return {
      items,
      nextCursor:
        found.length > items.length && lastItem
          ? encodeCursor(toOrderKey(lastItem))
          : null,
    }
  } catch (error) {
    throw toFriendlyError(error)
  }
}

const listSince = async ({
  userId,
  from,
}: ListSinceParams): Promise<Transaction[]> => {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        where('date', '>=', from),
        orderBy('date', 'desc')
      )
    )

    return snapshot.docs.map(toTransaction)
  } catch (error) {
    throw toFriendlyError(error)
  }
}

const create = async (
  userId: string,
  input: CreateTransactionInput
): Promise<Transaction> => {
  const transaction: Omit<Transaction, 'id'> = {
    userId,
    type: input.type,
    category: input.category,
    name: input.name,
    amount: input.amount,
    date: input.date,
    receipts: input.receipts ?? [],
    createdAt: new Date().toISOString(),
  }

  try {
    const reference = await addDoc(
      collection(db, COLLECTION),
      toDocument(transaction)
    )

    return { ...transaction, id: reference.id }
  } catch (error) {
    throw toFriendlyError(error)
  }
}

const buildUpdatePayload = (input: UpdateTransactionInput) => {
  const payload: Record<string, unknown> = {}

  if (input.type !== undefined) payload.transactionType = input.type
  if (input.category !== undefined) payload.category = input.category

  if (input.name !== undefined) {
    payload.name = input.name
    payload.nameLowercase = input.name.toLowerCase()
  }

  if (input.amount !== undefined) {
    payload.amount = input.amount
    payload.value = Math.abs(input.amount)
    payload.type = toRuleType(input.amount)
  }

  if (input.date !== undefined) payload.date = input.date
  if (input.receipts !== undefined) payload.receipts = input.receipts

  return payload
}

const update = async (
  id: string,
  input: UpdateTransactionInput
): Promise<Transaction> => {
  const reference = doc(db, COLLECTION, id)

  try {
    const snapshot = await getDoc(reference)

    if (!snapshot.exists()) throw new TransactionNotFoundError(id)

    const current = toTransaction(snapshot)

    await updateDoc(reference, buildUpdatePayload(input))

    return {
      ...current,
      ...input,
      receipts: input.receipts ?? current.receipts,
    }
  } catch (error) {
    throw toFriendlyError(error)
  }
}

const remove = async (id: string): Promise<void> => {
  const reference = doc(db, COLLECTION, id)

  try {
    const snapshot = await getDoc(reference)

    if (!snapshot.exists()) throw new TransactionNotFoundError(id)

    await deleteDoc(reference)
  } catch (error) {
    throw toFriendlyError(error)
  }
}

export const firebaseTransactionService: TransactionService = {
  list,
  listSince,
  create,
  update,
  remove,
}
