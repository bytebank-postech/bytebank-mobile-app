import { Image, ScrollView, View } from 'react-native'

import { Icon, Modal, Typography } from '@/components/ui'
import { formatFileSize, isImageMimeType } from '@/shared/utils/file'
import { colors } from '@/styles/colors'

import { styles } from './ReceiptViewerModal.styles'
import type { ReceiptViewerModalProps } from './ReceiptViewerModal.types'

const PREVIEW_NOTICE = 'Pré-visualização disponível apenas para imagens.'

export default function ReceiptViewerModal({
  isOpen,
  transactionName,
  receipts,
  onClose,
}: ReceiptViewerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.info}>
          <Typography
            variant="title-lg"
            weight="bold"
            color="active"
            style={styles.title}
          >
            Recibos
          </Typography>

          <Typography variant="body-sm" color="placeholder">
            {transactionName}
          </Typography>
        </View>

        {receipts.map((receipt) => (
          <View key={receipt.id} style={styles.receipt}>
            {isImageMimeType(receipt.mimeType) ? (
              <Image
                accessibilityLabel={`Recibo ${receipt.name}`}
                source={{ uri: receipt.downloadURL }}
                style={styles.preview}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.previewFallback}>
                <Icon name="description" size={48} color={colors.primary} />

                <Typography variant="body-sm" color="placeholder">
                  {PREVIEW_NOTICE}
                </Typography>
              </View>
            )}

            <View style={styles.info}>
              <Typography variant="body-sm" color="active">
                {receipt.name}
              </Typography>

              <Typography variant="body-sm" color="placeholder">
                {formatFileSize(receipt.size)}
              </Typography>
            </View>
          </View>
        ))}
      </ScrollView>
    </Modal>
  )
}
