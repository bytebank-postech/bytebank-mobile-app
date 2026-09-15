import * as DocumentPicker from 'expo-document-picker'

import type { PickedReceiptFile } from '@/shared/types/transaction'
import { ALLOWED_RECEIPT_MIME_TYPES } from '@/shared/validation/receipt-schema'

const FALLBACK_MIME_TYPE = 'application/octet-stream'

export const pickReceiptFile = async (): Promise<PickedReceiptFile | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...ALLOWED_RECEIPT_MIME_TYPES],
    copyToCacheDirectory: true,
    base64: false,
  })

  if (result.canceled) return null

  const [asset] = result.assets

  if (!asset) return null

  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? FALLBACK_MIME_TYPE,
    size: asset.size ?? 0,
  }
}
