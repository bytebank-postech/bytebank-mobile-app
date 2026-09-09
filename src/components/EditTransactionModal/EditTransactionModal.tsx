import { useState } from 'react'
import { Text, View } from 'react-native'

import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Modal from '@/components/ui/Modal/Modal'
import Select from '@/components/ui/Select/Select'
import Typography from '@/components/ui/Typography/Typography'

import type { TransactionType } from '@/types/transaction'

import { styles } from './EditTransactionModal.styles'

const transactionOptions = [
  { value: 'Depósito', label: 'Depósito' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Transferência', label: 'Transferência' },
  { value: 'Pagamento', label: 'Pagamento' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  initial?: {
    id?: string
    type: TransactionType
    name: string
    amount: number
  }
  onSubmit: (payload: {
    id?: string
    type: TransactionType
    name: string
    amount: number
  }) => Promise<void>
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: Props) {
  const [type, setType] = useState<TransactionType | ''>(initial?.type ?? '')

  const [name, setName] = useState(initial?.name ?? '')

  const [amount, setAmount] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.formInner}>
        <Typography
          variant="title-lg"
          color="white"
          weight="bold"
          style={styles.formTitle}
        >
          Editar transação
        </Typography>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelMuted}>Tipo de transação:</Text>

          <Select
            placeholder="Selecione o tipo de transação"
            options={transactionOptions}
            value={type}
            onChange={(value) => setType(value as TransactionType)}
            disabled={loading}
            style={styles.formSelect}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelMuted}>Descrição:</Text>

          <Input
            paddingSize="large"
            variant="default"
            placeholder="Ex.: Aluguel, presente, salário…"
            value={name}
            onChangeText={setName}
            editable={!loading}
            style={styles.formDescriptionInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.labelMuted}>Valor:</Text>

          <Input
            paddingSize="large"
            variant="default"
            placeholder="R$ 0,00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!loading}
            style={styles.formValueInput}
          />
        </View>

        {error ? (
          <Typography variant="body-sm" color="error" style={styles.formError}>
            {error}
          </Typography>
        ) : null}

        <Button
          size="large"
          variant="default"
          disabled={loading}
          style={styles.formSubmit}
        >
          {loading ? 'Atualizando…' : 'Salvar alterações'}
        </Button>
      </View>
    </Modal>
  )
}
