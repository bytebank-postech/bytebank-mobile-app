import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import Datepicker from '@/components/Datepicker/Datepicker'
import ReceiptsField from '@/components/ReceiptsField/ReceiptsField'
import {
  Button,
  FormField,
  Input,
  Modal,
  Select,
  Typography,
} from '@/components/ui'
import { receiptStorageService } from '@/services/receipts'
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  type Transaction,
  type TransactionReceipt,
} from '@/shared/types/transaction'
import { toISODate } from '@/shared/utils/date'
import {
  formatAmountInput,
  NAME_MAX_LENGTH,
  validateTransactionForm,
  type TransactionFieldErrors,
  type TransactionFormValues,
} from '@/shared/validation/transaction-schema'

import { styles } from './TransactionFormModal.styles'
import type { TransactionFormModalProps } from './TransactionFormModal.types'

const typeOptions = TRANSACTION_TYPES.map((type) => ({
  label: type,
  value: type,
}))

const categoryOptions = TRANSACTION_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}))

const buildInitialValues = (
  transaction?: Transaction | null
): TransactionFormValues => {
  if (!transaction) {
    return {
      type: '',
      category: '',
      direction: 'out',
      name: '',
      amount: '',
      date: toISODate(new Date()),
    }
  }

  return {
    type: transaction.type,
    category: transaction.category,
    direction: transaction.amount < 0 ? 'out' : 'in',
    name: transaction.name,
    amount: formatAmountInput(transaction.amount),
    date: transaction.date,
  }
}

export default function TransactionFormModal({
  isOpen,
  transaction,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const isEditing = Boolean(transaction)

  const [values, setValues] = useState<TransactionFormValues>(() =>
    buildInitialValues(transaction)
  )
  const [errors, setErrors] = useState<TransactionFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [receipts, setReceipts] = useState<TransactionReceipt[]>(
    () => transaction?.receipts ?? []
  )

  // Recibos já salvos que o usuário removeu. Só saem do storage depois que a
  // transação for salva sem eles, senão ela aponta para arquivo inexistente.
  const [pendingRemovals, setPendingRemovals] = useState<TransactionReceipt[]>(
    []
  )

  const savedReceiptPaths = new Set(
    (transaction?.receipts ?? []).map((receipt) => receipt.storagePath)
  )

  const setField = <Field extends keyof TransactionFormValues>(
    field: Field,
    value: TransactionFormValues[Field]
  ) => {
    setValues((current) => ({ ...current, [field]: value }))

    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current
    )
  }

  const discardFile = (receipt: TransactionReceipt) =>
    receiptStorageService.remove(receipt.storagePath).catch(() => undefined)

  const discardSessionUploads = () =>
    Promise.all(
      receipts
        .filter((receipt) => !savedReceiptPaths.has(receipt.storagePath))
        .map(discardFile)
    )

  const handleAddReceipt = (receipt: TransactionReceipt) => {
    setReceipts((current) => [...current, receipt])
  }

  const handleRemoveReceipt = (receipt: TransactionReceipt) => {
    setReceipts((current) => current.filter((item) => item.id !== receipt.id))

    if (!savedReceiptPaths.has(receipt.storagePath)) {
      void discardFile(receipt)
      return
    }

    setPendingRemovals((current) => [...current, receipt])
  }

  const closeForm = () => {
    setValues(buildInitialValues(transaction))
    setErrors({})
    setSubmitError(null)
    setReceipts(transaction?.receipts ?? [])
    setPendingRemovals([])
    onClose()
  }

  const handleCancel = () => {
    void discardSessionUploads()
    closeForm()
  }

  const handleSubmit = async () => {
    const result = validateTransactionForm(values)

    if (!result.success) {
      setErrors(result.errors)
      setSubmitError(null)
      return
    }

    setErrors({})
    setSubmitError(null)
    setIsSaving(true)

    try {
      await onSubmit({ ...result.data, receipts })

      void Promise.all(pendingRemovals.map(discardFile))
      closeForm()
    } catch (caught) {
      setSubmitError(
        caught instanceof Error && caught.message
          ? caught.message
          : 'Não foi possível salvar a transação.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const submitLabel = isEditing ? 'Salvar alterações' : 'Cadastrar transação'

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Typography
          variant="title-lg"
          weight="bold"
          color="active"
          style={styles.title}
        >
          {isEditing ? 'Editar transação' : 'Nova transação'}
        </Typography>

        <FormField required label="Tipo de transação" error={errors.type}>
          <Select
            placeholder="Selecione o tipo"
            options={typeOptions}
            value={values.type}
            onChange={(value) => setField('type', value)}
            disabled={isSaving}
            style={styles.fieldOnWhite}
          />
        </FormField>

        <FormField required label="Categoria" error={errors.category}>
          <Select
            placeholder="Selecione a categoria"
            options={categoryOptions}
            value={values.category}
            onChange={(value) => setField('category', value)}
            disabled={isSaving}
            style={styles.fieldOnWhite}
          />
        </FormField>

        <FormField required label="Movimentação" error={errors.direction}>
          <View style={styles.directionRow}>
            <Button
              size="medium"
              variant={values.direction === 'in' ? 'default' : 'outline'}
              disabled={isSaving}
              accessibilityRole="radio"
              accessibilityState={{ checked: values.direction === 'in' }}
              onPress={() => setField('direction', 'in')}
              style={styles.directionButton}
            >
              Entrada
            </Button>

            <Button
              size="medium"
              variant={values.direction === 'out' ? 'default' : 'outline'}
              disabled={isSaving}
              accessibilityRole="radio"
              accessibilityState={{ checked: values.direction === 'out' }}
              onPress={() => setField('direction', 'out')}
              style={styles.directionButton}
            >
              Saída
            </Button>
          </View>
        </FormField>

        <FormField required label="Descrição" error={errors.name}>
          <Input
            paddingSize="large"
            placeholder="Ex.: Aluguel, salário, mercado..."
            value={values.name}
            onChangeText={(value) => setField('name', value)}
            editable={!isSaving}
            maxLength={NAME_MAX_LENGTH}
            style={styles.fieldOnWhite}
          />
        </FormField>

        <FormField required label="Valor" error={errors.amount}>
          <Input
            paddingSize="large"
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={values.amount}
            onChangeText={(value) => setField('amount', value)}
            editable={!isSaving}
            style={styles.fieldOnWhite}
          />
        </FormField>

        <FormField required label="Data" error={errors.date}>
          <Datepicker
            value={values.date}
            disabled={isSaving}
            maximumDate={new Date()}
            onChange={(date) => setField('date', toISODate(date))}
            style={styles.fieldOnWhite}
          />
        </FormField>

        <ReceiptsField
          receipts={receipts}
          isDisabled={isSaving}
          onAdd={handleAddReceipt}
          onRemove={handleRemoveReceipt}
        />

        {submitError ? (
          <View accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Typography variant="body-sm" color="error" style={styles.submitError}>
              {submitError}
            </Typography>
          </View>
        ) : null}

        <Button
          size="large"
          fullWidth
          disabled={isSaving}
          onPress={handleSubmit}
        >
          {isSaving ? 'Salvando...' : submitLabel}
        </Button>
      </ScrollView>
    </Modal>
  )
}
