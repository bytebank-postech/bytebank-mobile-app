import { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Input, Paper, Select, TransactionItem, Typography } from '@/components/ui'
import type { Transaction } from '@/shared/types/transaction'
import { colors } from '@/styles/colors'

const categoryOptions = [
  { label: 'Todas as categorias', value: '' },
  { label: 'Alimentação', value: 'Alimentação' },
  { label: 'Moradia', value: 'Moradia' },
  { label: 'Transporte', value: 'Transporte' },
  { label: 'Saúde', value: 'Saúde' },
  { label: 'Lazer', value: 'Lazer' },
  { label: 'Educação', value: 'Educação' },
  { label: 'Salário', value: 'Salário' },
  { label: 'Outros', value: 'Outros' },
]

// Dados mocados para testes visuais e de filtros
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Depósito',
    name: 'Salário Mensal',
    amount: 5200,
    date: '2026-09-01',
    category: 'Salário',
  },
  {
    id: '2',
    type: 'Pix',
    name: 'Supermercado',
    amount: -350.8,
    date: '2026-09-02',
    category: 'Alimentação',
  },
  {
    id: '3',
    type: 'Transferência',
    name: 'Aluguel',
    amount: -1500,
    date: '2026-09-03',
    category: 'Moradia',
  },
  {
    id: '4',
    type: 'Pagamento',
    name: 'Farmácia',
    amount: -89.9,
    date: '2026-09-04',
    category: 'Saúde',
  },
  {
    id: '5',
    type: 'Pix',
    name: 'Uber',
    amount: -24.5,
    date: '2026-09-05',
    category: 'Transporte',
  },
  {
    id: '6',
    type: 'Pagamento',
    name: 'Cinema',
    amount: -60,
    date: '2026-09-06',
    category: 'Lazer',
  },
]

export default function TransactionScreen() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Filtro local em memória
  const filteredTransactions = mockTransactions.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Typography variant="title-lg" weight="bold" color="active">
          Minhas Transações
        </Typography>

        {/* Filtros */}
        <View style={styles.filterSection}>
          <Input
            placeholder="Pesquisar por descrição..."
            value={search}
            onChangeText={setSearch}
            paddingSize="large"
            style={styles.inputBackground}
          />
          <Select
            placeholder="Filtrar por Categoria"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={styles.inputBackground}
          />
        </View>

        {/* Lista com Mock */}
        <Paper style={styles.listCard}>
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem
                type={item.type}
                name={item.name}
                amount={item.amount}
                date={item.date}
                menuPlacement="inline-right"
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Typography color="placeholder">Nenhuma transação encontrada.</Typography>
              </View>
            }
          />
        </Paper>
      </View>
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
  inputBackground: {
    backgroundColor: colors.white,
  },
  listCard: {
    flex: 1,
    padding: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
})