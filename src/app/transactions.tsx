import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Datepicker from '@/components/Datepicker/Datepicker'
import TransactionFormModal from '@/components/TransactionFormModal/TransactionFormModal'
import {
  Button,
  ConfirmDialog,
  Input,
  Loader,
  Paper,
  Select,
  TransactionItem,
  Typography,
} from '@/components/ui'
import { useTransactions } from '@/contexts/transactions-context'
import type { CreateTransactionInput } from '@/services/transactions'
import {
  TRANSACTION_CATEGORIES,
  type Transaction,
  type TransactionCategory,
} from '@/shared/types/transaction'
import { formatDateToBR, toISODate } from '@/shared/utils/date'
import { colors } from '@/styles/colors'

const SEARCH_DEBOUNCE_MS = 400

const categoryOptions = [
  { label: 'Todas as categorias', value: '' },
  ...TRANSACTION_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
]

const buildRemoveMessage = (name: string) =>
  `Excluir "${name}"? Essa ação não pode ser desfeita.`

export default function TransactionScreen() {
  const {
    transactions,
    filters,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    setFilters,
    refresh,
    loadMore,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [transactionToRemove, setTransactionToRemove] =
    useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({
        search: search.trim() || undefined,
        category: (category || undefined) as TransactionCategory | undefined,
        from: from || undefined,
        to: to || undefined,
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [search, category, from, to, setFilters])

  const hasActiveFilters = Boolean(search || category || from || to)

  const isEmpty = transactions.length === 0

  const handleClearFilters = () => {
    setSearch('')
    setCategory('')
    setFrom('')
    setTo('')
  }

  const handleOpenCreateForm = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleOpenEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleSubmitForm = (input: CreateTransactionInput) =>
    editingTransaction
      ? updateTransaction(editingTransaction.id, input)
      : createTransaction(input)

  const handleOpenRemoveDialog = (transaction: Transaction) => {
    setTransactionToRemove(transaction)
  }

  const handleCloseRemoveDialog = () => {
    setTransactionToRemove(null)
  }

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )
    }

    if (error && !isEmpty) {
      return (
        <View style={styles.footer}>
          <Typography variant="body-sm" color="error">
            {error}
          </Typography>

          <Button size="medium" variant="outline" onPress={loadMore}>
            Tentar novamente
          </Button>
        </View>
      )
    }

    if (!hasMore && !isEmpty) {
      return (
        <View style={styles.footer}>
          <Typography variant="body-sm" color="placeholder">
            Fim da lista
          </Typography>
        </View>
      )
    }

    return null
  }

  const renderContent = () => {
    if (isLoading) return <Loader />

    if (error && isEmpty) {
      return (
        <View style={styles.stateContainer}>
          <Typography color="error">{error}</Typography>

          <Button size="medium" onPress={refresh}>
            Tentar novamente
          </Button>
        </View>
      )
    }

    return (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            type={item.type}
            name={item.name}
            amount={item.amount}
            date={formatDateToBR(item.date)}
            hasReceipts={item.receipts.length > 0}
            menuItems={[
              {
                id: 'edit',
                label: 'Editar',
                onClick: () => handleOpenEditForm(item),
              },
              {
                id: 'remove',
                label: 'Excluir',
                onClick: () => handleOpenRemoveDialog(item),
              },
            ]}
            menuPlacement="inline-right"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={isEmpty ? styles.emptyList : undefined}
        ListEmptyComponent={
          <View style={styles.stateContainer}>
            <Typography color="placeholder">
              {hasActiveFilters
                ? 'Nenhuma transação encontrada para os filtros aplicados.'
                : 'Você ainda não tem transações registradas.'}
            </Typography>

            {hasActiveFilters ? (
              <Button
                size="medium"
                variant="outline"
                onPress={handleClearFilters}
              >
                Limpar filtros
              </Button>
            ) : null}
          </View>
        }
        ListFooterComponent={renderFooter}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Typography variant="title-lg" weight="bold" color="active">
          Minhas Transações
        </Typography>

        <Button size="large" fullWidth onPress={handleOpenCreateForm}>
          Nova transação
        </Button>

        <View style={styles.filterSection}>
          <Input
            placeholder="Buscar pelo início da descrição..."
            value={search}
            onChangeText={setSearch}
            paddingSize="large"
            style={styles.inputBackground}
          />

          {filters.search ? (
            <Typography variant="body-sm" color="placeholder">
              Resultados em ordem alfabética de descrição.
            </Typography>
          ) : null}

          <Select
            placeholder="Filtrar por Categoria"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            style={styles.inputBackground}
          />

          <View style={styles.periodRow}>
            <View style={styles.periodField}>
              <Datepicker
                placeholder="De"
                value={from}
                maximumDate={to ? new Date(`${to}T12:00:00`) : undefined}
                onChange={(date) => setFrom(toISODate(date))}
                style={styles.inputBackground}
              />
            </View>

            <View style={styles.periodField}>
              <Datepicker
                placeholder="Até"
                value={to}
                minimumDate={from ? new Date(`${from}T12:00:00`) : undefined}
                onChange={(date) => setTo(toISODate(date))}
                style={styles.inputBackground}
              />
            </View>
          </View>

          {hasActiveFilters ? (
            <Button size="medium" variant="ghost" onPress={handleClearFilters}>
              Limpar filtros
            </Button>
          ) : null}
        </View>

        <Paper style={styles.listCard}>{renderContent()}</Paper>
      </View>

      {/* A key remonta o formulário: o Modal do RN não desmonta ao fechar. */}
      <TransactionFormModal
        key={editingTransaction?.id ?? 'new'}
        isOpen={isFormOpen}
        transaction={editingTransaction}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      {transactionToRemove ? (
        <ConfirmDialog
          isOpen
          title="Excluir transação"
          message={buildRemoveMessage(transactionToRemove.name)}
          confirmLabel="Excluir"
          pendingLabel="Excluindo..."
          onConfirm={() => removeTransaction(transactionToRemove.id)}
          onClose={handleCloseRemoveDialog}
        />
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  mainContent: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  filterSection: {
    gap: 12,
    zIndex: 50, // Força a camada ficar por cima no iOS
    elevation: 50, // Força a camada ficar por cima no Android
  },
  periodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  periodField: {
    flex: 1,
  },
  inputBackground: {
    backgroundColor: colors.white,
  },
  listCard: {
    flex: 1,
    padding: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stateContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
})
