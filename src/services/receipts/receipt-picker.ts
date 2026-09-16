import * as DocumentPicker from 'expo-document-picker'
import { Platform } from 'react-native'

import type { PickedReceiptFile } from '@/shared/types/transaction'
import { ALLOWED_RECEIPT_MIME_TYPES } from '@/shared/validation/receipt-schema'

const FALLBACK_MIME_TYPE = 'application/octet-stream'

// No web o expo-file-system não lê arquivos, então o conteúdo precisa vir do
// próprio picker: com base64 ativo ele preenche asset.base64 com o data URI
// completo, enquanto asset.uri continua sendo um blob inacessível ao nativo.
export const pickReceiptFile = async (): Promise<PickedReceiptFile | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...ALLOWED_RECEIPT_MIME_TYPES],
    copyToCacheDirectory: true,
    base64: Platform.OS === 'web',
  })

  if (result.canceled) return null

  const [asset] = result.assets

  if (!asset) return null

  return {
    uri: asset.base64 ?? asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? FALLBACK_MIME_TYPE,
    size: asset.size ?? 0,
  }
}
