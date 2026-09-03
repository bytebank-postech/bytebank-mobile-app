import { Button, Modal, TransactionItem, Typography } from '@/components/ui'
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
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
