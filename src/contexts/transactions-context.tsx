import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  transactionService,
  type CreateTransactionInput,
  type TransactionFilters,
  type UpdateTransactionInput,
} from '@/services/transactions'
import type { Transaction } from '@/shared/types/transaction'

import { useAuth } from './auth-context'

const FALLBACK_ERROR = 'Não foi possível carregar suas transações.'
const SIGNED_OUT_ERROR = 'Faça login para registrar transações.'

const getErrorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : FALLBACK_ERROR

const areFiltersEqual = (a: TransactionFilters, b: TransactionFilters) =>
  a.category === b.category &&
  a.from === b.from &&
  a.to === b.to &&
  a.search === b.search

type TransactionsContextValue = {
  transactions: Transaction[]
  filters: TransactionFilters
  isLoading: boolean
  isLoadingMore: boolean
  isRefreshing: boolean
  error: string | null
  hasMore: boolean
  setFilters: (filters: TransactionFilters) => void
  refresh: () => void
  loadMore: () => void
  createTransaction: (input: CreateTransactionInput) => Promise<void>
  updateTransaction: (
    id: string,
    input: UpdateTransactionInput
  ) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

export const TransactionsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { user, isLoading: isAuthLoading } = useAuth()

  const userId = user?.uid ?? null

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFiltersState] = useState<TransactionFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const isLoadingMoreRef = useRef(false)

  const filtersRef = useRef<TransactionFilters>(filters)

  const fetchFirstPage = useCallback(
    async (activeFilters: TransactionFilters) => {
      requestIdRef.current += 1
      const requestId = requestIdRef.current

      if (!userId) {
        setTransactions([])
        setCursor(null)
        setError(null)
        setIsLoading(false)
        setIsRefreshing(false)
        return
      }

      try {
        const result = await transactionService.list({
          userId,
          filters: activeFilters,
        })

        if (requestIdRef.current !== requestId) return

        setTransactions(result.items)
        setCursor(result.nextCursor)
        setError(null)
      } catch (caught) {
        if (requestIdRef.current !== requestId) return

        setError(getErrorMessage(caught))
        setTransactions([])
        setCursor(null)
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    },
    [userId]
  )

  useEffect(() => {
    if (isAuthLoading) return

    fetchFirstPage(filtersRef.current)
  }, [fetchFirstPage, isAuthLoading])

  const setFilters = useCallback(
    (next: TransactionFilters) => {
      if (areFiltersEqual(filtersRef.current, next)) return

      filtersRef.current = next
      setFiltersState(next)
      setIsLoading(true)
      setError(null)

      fetchFirstPage(next)
    },
    [fetchFirstPage]
  )

  const refresh = useCallback(() => {
    setIsRefreshing(true)
    setError(null)

    fetchFirstPage(filtersRef.current)
  }, [fetchFirstPage])

  const loadMore = useCallback(async () => {
    if (!userId || !cursor || isLoadingMoreRef.current) return

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setError(null)

    const requestId = requestIdRef.current

    try {
      const result = await transactionService.list({
        userId,
        filters: filtersRef.current,
        cursor,
      })

      if (requestIdRef.current !== requestId) return

      setTransactions((current) => [...current, ...result.items])
      setCursor(result.nextCursor)
    } catch (caught) {
      if (requestIdRef.current === requestId) setError(getErrorMessage(caught))
    } finally {
      isLoadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [cursor, userId])

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      if (!userId) throw new Error(SIGNED_OUT_ERROR)

      await transactionService.create(userId, input)

      setIsLoading(true)
      setError(null)
      void fetchFirstPage(filtersRef.current)
    },
    [fetchFirstPage, userId]
  )

  const updateTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput) => {
      await transactionService.update(id, input)

      setIsLoading(true)
      setError(null)
      void fetchFirstPage(filtersRef.current)
    },
    [fetchFirstPage]
  )

  const removeTransaction = useCallback(
    async (id: string) => {
      await transactionService.remove(id)

      setIsLoading(true)
      setError(null)
      void fetchFirstPage(filtersRef.current)
    },
    [fetchFirstPage]
  )

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        filters,
        isLoading,
        isLoadingMore,
        isRefreshing,
        error,
        hasMore: cursor !== null,
        setFilters,
        refresh,
        loadMore,
        createTransaction,
        updateTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export const useTransactions = () => {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error(
      'useTransactions precisa ser usado dentro de <TransactionsProvider>.'
    )
  }

  return context
}
