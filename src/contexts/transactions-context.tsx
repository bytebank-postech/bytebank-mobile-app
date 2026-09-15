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
import {
  buildTransactionSummary,
  getSummaryStartDate,
  type TransactionSummary,
} from '@/shared/utils/transaction-summary'

import { useAuth } from './auth-context'

const RECENT_TRANSACTIONS_LIMIT = 5

const FALLBACK_ERROR = 'Não foi possível carregar suas transações.'
const SUMMARY_FALLBACK_ERROR = 'Não foi possível carregar o resumo financeiro.'
const SIGNED_OUT_ERROR = 'Faça login para registrar transações.'

const getErrorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : FALLBACK_ERROR

const getSummaryErrorMessage = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : SUMMARY_FALLBACK_ERROR

const areFiltersEqual = (a: TransactionFilters, b: TransactionFilters) =>
  a.category === b.category &&
  a.from === b.from &&
  a.to === b.to &&
  a.search === b.search

type TransactionsContextValue = {
  transactions: Transaction[]
  recentTransactions: Transaction[]
  filters: TransactionFilters
  summary: TransactionSummary | null
  isLoading: boolean
  isLoadingMore: boolean
  isRefreshing: boolean
  isSummaryLoading: boolean
  error: string | null
  summaryError: string | null
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
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  )
  const [filters, setFiltersState] = useState<TransactionFilters>({})
  const [summary, setSummary] = useState<TransactionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const summaryRequestIdRef = useRef(0)

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

  const fetchSummary = useCallback(async () => {
    summaryRequestIdRef.current += 1
    const requestId = summaryRequestIdRef.current

    if (!userId) {
      setSummary(null)
      setRecentTransactions([])
      setSummaryError(null)
      setIsSummaryLoading(false)
      return
    }

    try {
      const items = await transactionService.listSince({
        userId,
        from: getSummaryStartDate(new Date()),
      })

      if (summaryRequestIdRef.current !== requestId) return

      setSummary(buildTransactionSummary(items))
      setRecentTransactions(items.slice(0, RECENT_TRANSACTIONS_LIMIT))
      setSummaryError(null)
    } catch (caught) {
      if (summaryRequestIdRef.current !== requestId) return

      setSummary(null)
      setRecentTransactions([])
      setSummaryError(getSummaryErrorMessage(caught))
    } finally {
      if (summaryRequestIdRef.current === requestId) setIsSummaryLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (isAuthLoading) return

    fetchFirstPage(filtersRef.current)
    fetchSummary()
  }, [fetchFirstPage, fetchSummary, isAuthLoading])

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
    setIsSummaryLoading(true)

    fetchFirstPage(filtersRef.current)
    fetchSummary()
  }, [fetchFirstPage, fetchSummary])

  const reload = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setIsSummaryLoading(true)

    void fetchFirstPage(filtersRef.current)
    void fetchSummary()
  }, [fetchFirstPage, fetchSummary])

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

      reload()
    },
    [reload, userId]
  )

  const updateTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput) => {
      await transactionService.update(id, input)

      reload()
    },
    [reload]
  )

  const removeTransaction = useCallback(
    async (id: string) => {
      await transactionService.remove(id)

      reload()
    },
    [reload]
  )

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        recentTransactions,
        filters,
        summary,
        isLoading,
        isLoadingMore,
        isRefreshing,
        isSummaryLoading,
        error,
        summaryError,
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
