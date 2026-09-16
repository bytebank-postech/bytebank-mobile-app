import { useState } from 'react'
import { Image, Pressable, View } from 'react-native'

import { Button, FormField, Icon, Typography } from '@/components/ui'
import { useAuth } from '@/contexts/auth-context'
import { pickReceiptFile, receiptStorageService } from '@/services/receipts'
import { formatFileSize, isImageMimeType } from '@/shared/utils/file'
import { validateReceiptAddition } from '@/shared/validation/receipt-schema'
import { colors } from '@/styles/colors'

import { styles } from './ReceiptsField.styles'
import type { ReceiptsFieldProps } from './ReceiptsField.types'

const FALLBACK_ERROR = 'Não foi possível anexar o arquivo.'
const SIGNED_OUT_ERROR = 'Faça login para anexar recibos.'

export default function ReceiptsField({
  receipts,
  isDisabled,
  onAdd,
  onRemove,
}: ReceiptsFieldProps) {
  const { user } = useAuth()

  const userId = user?.uid

  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAttach = async () => {
    setError(null)

    if (!userId) {
      setError(SIGNED_OUT_ERROR)
      return
    }

    try {
      const file = await pickReceiptFile()

      if (!file) return

      const invalidReason = validateReceiptAddition(file, receipts)

      if (invalidReason) {
        setError(invalidReason)
        return
      }

      setIsUploading(true)

      const receipt = await receiptStorageService.upload({ userId, file })

      onAdd(receipt)
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : FALLBACK_ERROR
      )
    } finally {
      setIsUploading(false)
    }
  }

  const attachLabel = isUploading ? 'Anexando...' : 'Anexar recibo'

  return (
    <FormField label="Recibos" error={error ?? undefined}>
      <View style={styles.list}>
        {receipts.length === 0 ? (
          <Typography variant="body-sm" color="placeholder">
            Nenhum recibo anexado.
          </Typography>
        ) : null}

        {receipts.map((receipt) => (
          <View key={receipt.id} style={styles.receipt}>
            {isImageMimeType(receipt.mimeType) ? (
              <Image
                accessibilityLabel={`Pré-visualização de ${receipt.name}`}
                source={{ uri: receipt.downloadURL }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailFallback}>
                <Icon name="description" size={20} color={colors.primary} />
              </View>
            )}

            <View style={styles.receiptInfo}>
              <Typography variant="body-sm" color="active">
                {receipt.name}
              </Typography>

              <Typography variant="body-sm" color="placeholder">
                {formatFileSize(receipt.size)}
              </Typography>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover ${receipt.name}`}
              disabled={isDisabled || isUploading}
              onPress={() => onRemove(receipt)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed,
              ]}
            >
              <Icon name="close" size={20} color={colors.typographyError} />
            </Pressable>
          </View>
        ))}
      </View>

      <Button
        size="medium"
        variant="outline"
        disabled={isDisabled || isUploading}
        onPress={handleAttach}
      >
        {attachLabel}
      </Button>
    </FormField>
  )
}
