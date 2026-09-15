import { Redirect, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Avatar from '@/components/Avatar/Avatar'
import TransactionFormModal from '@/components/TransactionFormModal/TransactionFormModal'
import {
  Button,
  Chart,
  ConfirmDialog,
  FadeInView,
  Loader,
  Paper,
  PopupMenu,
  TransactionItem,
  Typography,
} from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { useTransactions } from '@/contexts/transactions-context'
import type { CreateTransactionInput } from '@/services/transactions'
import type {
  Transaction,
  TransactionType,
} from '@/shared/types/transaction'
import { formatDateToBR } from '@/shared/utils/date'
import { buildRemoveTransactionMessage } from '@/shared/utils/transaction-messages'
import { SUMMARY_MONTHS } from '@/shared/utils/transaction-summary'
import { colors } from '@/styles/colors'

const TYPE_COLORS: Record<TransactionType, string> = {
  Depósito: colors.primary,
  Pix: colors.tertiaryAction,
  Transferência: colors.secondaryAction,
  Pagamento: colors.success,
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const formatToday = () =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const BALANCE_FADE_MS = 250

export default function Home() {
  const router = useRouter()

  const { user, isLoading: isAuthLoading, signOut } = useAuth()

  const {
    recentTransactions,
    summary,
    isSummaryLoading,
    summaryError,
    refresh,
    createTransaction,
    removeTransaction,
  } = useTransactions()

  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [transactionToRemove, setTransactionToRemove] =
    useState<Transaction | null>(null)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const [balanceOpacity] = useState(() => new Animated.Value(0))

  useEffect(() => {
    balanceOpacity.setValue(0)

    const animation = Animated.timing(balanceOpacity, {
      toValue: 1,
      duration: BALANCE_FADE_MS,
      useNativeDriver: true,
    })

    animation.start()

    return () => animation.stop()
  }, [balanceOpacity, isBalanceVisible, summary?.balance])

  if (!isAuthLoading && !user) {
    return <Redirect href="/login" />
  }

  const monthlyData = (summary?.monthly ?? []).map((month) => ({
    name: month.label,
    Receitas: month.income,
    Despesas: month.expenses,
  }))

  const typeTotals = (summary?.byType ?? []).filter((item) => item.total > 0)

  const typeData = typeTotals.map((item) => ({
    name: item.type,
    value: item.total,
    fill: TYPE_COLORS[item.type],
  }))

  const typeSeries = typeTotals.map((item) => ({
    key: item.type,
    name: item.type,
    color: TYPE_COLORS[item.type],
  }))

  const handleToggleBalance = () => {
    setIsBalanceVisible((current) => !current)
  }

  const handleSignOut = async () => {
    setSignOutError(null)

    try {
      await signOut()
      router.replace('/login')
    } catch (caught) {
      setSignOutError(
        caught instanceof Error && caught.message
          ? caught.message
          : 'Não foi possível sair.'
      )
    }
  }

  const handleOpenForm = () => {
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
  }

  const handleSubmitForm = (input: CreateTransactionInput) =>
    createTransaction(input)

  const handleOpenRemoveDialog = (transaction: Transaction) => {
    setTransactionToRemove(transaction)
  }

  const handleCloseRemoveDialog = () => {
    setTransactionToRemove(null)
  }

  const handleSeeAllTransactions = () => {
    router.push('/transactions')
  }

  const renderAnalytics = () => {
    if (isSummaryLoading && !summary) return <Loader />

    if (summaryError) {
      return (
        <View style={styles.stateContainer}>
          <Typography color="error">{summaryError}</Typography>

          <Button size="medium" onPress={refresh}>
            Tentar novamente
          </Button>
        </View>
      )
    }

    return (
      <>
        <FadeInView>
          <Paper style={styles.chartCard}>
            <Chart
              title="Receitas x Despesas"
              type="line"
              data={monthlyData}
              series={[
                { key: 'Receitas', name: 'Receitas', color: colors.success },
                { key: 'Despesas', name: 'Despesas', color: colors.secondary },
              ]}
              axis={{ x: { key: 'name', show: true }, y: { show: true } }}
            />
          </Paper>
        </FadeInView>

        <FadeInView delay={120}>
          <Paper style={styles.chartCard}>
            {typeData.length ? (
              <Chart
                title="Distribuição por tipo"
                type="pie"
                data={typeData}
                series={typeSeries}
                axis={{ x: { show: false }, y: { show: false } }}
              />
            ) : (
              <Typography color="placeholder">
                Sem movimentações no período.
              </Typography>
            )}
          </Paper>
        </FadeInView>
      </>
    )
  }

  const renderStatement = () => {
    if (isSummaryLoading && recentTransactions.length === 0) return <Loader />

    if (recentTransactions.length === 0) {
      return (
        <Typography color="placeholder">
          Você ainda não tem transações registradas.
        </Typography>
      )
    }

    return recentTransactions.map((transaction) => (
      <TransactionItem
        key={transaction.id}
        type={transaction.type}
        name={transaction.name}
        amount={transaction.amount}
        date={formatDateToBR(transaction.date)}
        hasReceipts={transaction.receipts.length > 0}
        menuPlacement="home-stacked-date"
        menuItems={[
          {
            id: `remove-${transaction.id}`,
            label: 'Excluir',
            onClick: () => handleOpenRemoveDialog(transaction),
          },
        ]}
      />
    ))
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Typography variant="title-lg" color="active" weight="bold">
              Olá!
            </Typography>

            <Typography variant="body-sm" color="placeholder">
              {formatToday()}
            </Typography>
          </View>

          <PopupMenu
            align="right"
            items={[
              {
                id: 'logout',
                label: 'Sair',
                onClick: handleSignOut,
              },
            ]}
          >
            <Avatar />
          </PopupMenu>
        </View>

        {signOutError ? (
          <View accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Typography variant="body-sm" color="error">
              {signOutError}
            </Typography>
          </View>
        ) : null}

        <FadeInView>
          <Paper color="primary" style={styles.balanceCard}>
            <View style={styles.balanceTopRow}>
              <Typography color="white">Saldo</Typography>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isBalanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'
                }
                onPress={handleToggleBalance}
              >
                <Typography color="white">
                  {isBalanceVisible ? 'Ocultar' : 'Mostrar'}
                </Typography>
              </Pressable>
            </View>

            <Animated.View style={{ opacity: balanceOpacity }}>
              <Typography variant="title-lg" color="white" weight="bold">
                {isBalanceVisible
                  ? formatCurrency(summary?.balance ?? 0)
                  : 'R$ ••••••'}
              </Typography>
            </Animated.View>

            <Typography variant="body-sm" color="white">
              {`Conta corrente nos últimos ${SUMMARY_MONTHS} meses`}
            </Typography>
          </Paper>
        </FadeInView>

        <FadeInView delay={80} style={styles.sectionHeader}>
          <Typography variant="title-lg" color="active" weight="bold">
            Análises financeiras
          </Typography>

          <Typography variant="body-sm" color="placeholder">
            {`Últimos ${SUMMARY_MONTHS} meses`}
          </Typography>
        </FadeInView>

        {renderAnalytics()}

        <FadeInView delay={160}>
          <Button size="large" fullWidth onPress={handleOpenForm}>
            Nova transação
          </Button>
        </FadeInView>

        <FadeInView delay={240}>
          <Paper style={styles.statement}>
            <View style={styles.statementHeader}>
              <Typography variant="title-lg" color="active" weight="bold">
                Extrato
              </Typography>

              <Button
                size="medium"
                variant="ghost"
                onPress={handleSeeAllTransactions}
              >
                Ver todas
              </Button>
            </View>

            {renderStatement()}
          </Paper>
        </FadeInView>
      </ScrollView>

      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
      />

      {transactionToRemove ? (
        <ConfirmDialog
          isOpen
          title="Excluir transação"
          message={buildRemoveTransactionMessage(transactionToRemove.name)}
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.tertiary,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceCard: {
    gap: 8,
    padding: 20,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: 8,
    gap: 2,
  },
  chartCard: {
    padding: 12,
    overflow: 'hidden',
  },
  statement: {
    gap: 12,
    padding: 16,
  },
  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
})
