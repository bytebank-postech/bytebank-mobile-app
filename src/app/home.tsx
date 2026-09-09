import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import Avatar from '@/components/Avatar/Avatar'
import Datepicker from '@/components/Datepicker/Datepicker'
import {
  Button,
  Chart,
  Input,
  Modal,
  Paper,
  PopupMenu,
  Select,
  TransactionItem,
  Typography,
} from '@/components/ui'
import { colors } from '@/styles/colors'
import type { Transaction, TransactionType } from '@/types/transaction'

const typeOptions = [
  { value: 'Depósito', label: 'Depósito' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Transferência', label: 'Transferência' },
  { value: 'Pagamento', label: 'Pagamento' },
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Depósito',
    name: 'Salário',
    amount: 5200,
    date: '2026-09-03',
  },
  {
    id: '2',
    type: 'Pix',
    name: 'Mercado',
    amount: -180.5,
    date: '2026-09-02',
  },
  {
    id: '3',
    type: 'Transferência',
    name: 'Aluguel',
    amount: -1400,
    date: '2026-09-01',
  },
]

const formatDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`)
  return date.toLocaleDateString('pt-BR')
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export default function Home() {
  const router = useRouter()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<TransactionType | ''>('')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const balance = transactions.reduce((total, item) => total + item.amount, 0)
  const monthlyData = [
    {
      name: 'Set',
      Receitas: transactions
        .filter((item) => item.amount >= 0)
        .reduce((total, item) => total + item.amount, 0),
      Despesas: transactions
        .filter((item) => item.amount < 0)
        .reduce((total, item) => total + Math.abs(item.amount), 0),
    },
  ]
  const typeData = typeOptions.map((option) => ({
    name: option.label,
    value: transactions
      .filter((item) => item.type === option.value)
      .reduce((total, item) => total + Math.abs(item.amount), 0),
  }))

  function createTransaction() {
    const numericAmount = Number(amount.replace(',', '.'))
    if (!type || !name.trim() || !numericAmount || !date) {
      Alert.alert('Nova transação', 'Preencha todos os campos.')
      return
    }

    const isIncome = type === 'Depósito' || type === 'Pix'
    setTransactions((current) => [
      {
        id: String(Date.now()),
        type,
        name: name.trim(),
        amount: isIncome ? Math.abs(numericAmount) : -Math.abs(numericAmount),
        date,
      },
      ...current,
    ])
    setType('')
    setName('')
    setAmount('')
    setDate('')
    setIsModalOpen(false)
  }

  function removeTransaction(id: string) {
    Alert.alert('Excluir transação', 'Deseja excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          setTransactions((current) =>
            current.filter((transaction) => transaction.id !== id)
          ),
      },
    ])
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
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Typography>
          </View>
          <PopupMenu
            align="right"
            items={[
              {
                id: 'logout',
                label: 'Sair',
                onClick: () => router.replace('/login'),
              },
            ]}
          >
            <Avatar />
          </PopupMenu>
        </View>

        <Paper color="primary" style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <Typography color="white">Saldo</Typography>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'
              }
              onPress={() => setBalanceVisible((current) => !current)}
            >
              <Typography color="white">{balanceVisible ? 'Ocultar' : 'Mostrar'}</Typography>
            </Pressable>
          </View>
          <Typography variant="title-lg" color="white" weight="bold">
            {balanceVisible ? formatCurrency(balance) : 'R$ ••••••'}
          </Typography>
          <Typography variant="body-sm" color="white">
            Conta corrente
          </Typography>
        </Paper>

        <View style={styles.sectionHeader}>
          <Typography variant="title-lg" color="active" weight="bold">
            Análises financeiras
          </Typography>
        </View>
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
        <Paper style={styles.chartCard}>
          <Chart
            title="Distribuição por tipo"
            type="pie"
            data={typeData}
            series={[{ key: 'value', name: 'Movimentações' }]}
            axis={{ x: { show: false }, y: { show: false } }}
          />
        </Paper>

        <Button size="large" fullWidth onPress={() => setIsModalOpen(true)}>
          Nova transação
        </Button>

        <Paper style={styles.statement}>
          <Typography variant="title-lg" color="active" weight="bold">
            Extrato
          </Typography>
          {transactions.length === 0 ? (
            <Typography color="active">Nenhuma transação encontrada.</Typography>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                name={transaction.name}
                amount={transaction.amount}
                date={formatDate(transaction.date)}
                menuPlacement="home-stacked-date"
                menuItems={[
                  {
                    id: `delete-${transaction.id}`,
                    label: 'Excluir',
                    onClick: () => removeTransaction(transaction.id),
                  },
                ]}
              />
            ))
          )}
        </Paper>
      </ScrollView>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <View style={styles.form}>
          <Typography variant="title-lg" color="active" weight="bold">
            Nova transação
          </Typography>
          <Select
            placeholder="Selecione o tipo de transação"
            options={typeOptions}
            value={type}
            onChange={(value) => setType(value as TransactionType)}
          />
          <Input
            paddingSize="large"
            placeholder="Descrição"
            value={name}
            onChangeText={setName}
          />
          <Input
            paddingSize="large"
            placeholder="Valor"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <Datepicker
            label="Data"
            value={date}
            onChange={(selectedDate) =>
              setDate(selectedDate.toISOString().slice(0, 10))
            }
          />
          <Button size="large" fullWidth onPress={createTransaction}>
            Concluir transação
          </Button>
        </View>
      </Modal>
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
    zIndex: 40,
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
  },
  chartCard: {
    padding: 12,
    overflow: 'hidden',
  },
  statement: {
    gap: 12,
    padding: 16,
  },
  form: {
    gap: 16,
  },
})
