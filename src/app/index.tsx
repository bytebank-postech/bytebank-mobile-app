import Avatar from '@/components/Avatar/Avatar'
import {
  Button,
  Chart,
  Checkbox,
  Input,
  Modal,
  Pagination,
  TransactionItem,
  Typography,
} from '@/components/ui'
import { Link } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function HomeScreen() {
  const [selected, setSelected] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  return (
    <SafeAreaView>
      <View>
        <Button onPress={handleOpenModal}>Abrir Modal</Button>
        <Link href="/home">Ir para home</Link>
        <Avatar />
        <TransactionItem
          type="Pix"
          name="João"
          amount={150}
          date="03/09/2026"
          selected={selected}
          onSelectedChange={setSelected}
        />
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <View>
            <Typography variant="body">Modal Aberto</Typography>
            <Input
              placeholder="Digite algo"
              onChangeText={(val) => console.log(val)}
            />
            <Checkbox
              id="teste"
              type="checkbox"
              onChange={(value) => console.log(value)}
              value={'teste'}
              label="Checkbox de teste"
            />
            {/* <Datepicker onChange={(date) => console.log(date)} /> */}
            <Pagination
              currentPage={1}
              totalItems={100}
              pageSize={10}
              onPageChange={(page) => console.log(page)}
            />
          </View>
        </Modal>
        <Chart
          title="Monthly revenue"
          type="line"
          data={[
            { month: 'Jan', revenue: 1200 },
            { month: 'Feb', revenue: 1800 },
            { month: 'Mar', revenue: 1500 },
          ]}
          series={[
            {
              key: 'revenue',
              name: 'Revenue',
              color: '#004d61',
            },
          ]}
          axis={{
            x: { key: 'month', show: true },
            y: { show: true },
          }}
        />
        <Chart
          title="Expenses"
          type="bar"
          data={[
            { month: 'Jan', expenses: 700 },
            { month: 'Feb', expenses: 900 },
          ]}
          series={[{ key: 'expenses', name: 'Expenses', color: '#d33418' }]}
          axis={{
            x: { key: 'month', show: true },
            y: { show: true },
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
