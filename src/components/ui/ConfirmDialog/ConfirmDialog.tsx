import { useState } from 'react'
import { View } from 'react-native'

import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import Typography from '../Typography/Typography'

import { styles } from './ConfirmDialog.styles'
import type { ConfirmDialogProps } from './ConfirmDialog.types'

const FALLBACK_ERROR = 'Não foi possível concluir a ação. Tente novamente.'

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  pendingLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    setError(null)
    setIsConfirming(true)

    try {
      await onConfirm()
      handleClose()
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : FALLBACK_ERROR
      )
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <View style={styles.content}>
        <Typography
          variant="title"
          weight="bold"
          color="active"
          style={styles.title}
        >
          {title}
        </Typography>

        <Typography variant="body-sm" color="active">
          {message}
        </Typography>

        {error ? (
          <View accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Typography variant="body-sm" color="error">
              {error}
            </Typography>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            size="medium"
            variant="outline"
            disabled={isConfirming}
            onPress={handleClose}
            style={styles.action}
          >
            Cancelar
          </Button>

          <Button
            size="medium"
            disabled={isConfirming}
            onPress={handleConfirm}
            style={styles.action}
          >
            {isConfirming ? pendingLabel : confirmLabel}
          </Button>
        </View>
      </View>
    </Modal>
  )
}
