import type { PickedReceiptFile } from '@/shared/types/transaction'
import { formatFileSize } from '@/shared/utils/file'

export const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const isAllowedMimeType = (mimeType: string) =>
  ALLOWED_RECEIPT_MIME_TYPES.some((allowed) => allowed === mimeType)

export const validateReceiptFile = (file: PickedReceiptFile): string | null => {
  if (!isAllowedMimeType(file.mimeType)) {
    return 'Formato não aceito. Envie PDF, JPG, PNG ou WEBP.'
  }

  if (file.size <= 0) {
    return 'O arquivo parece estar vazio.'
  }

  if (file.size > MAX_RECEIPT_SIZE_BYTES) {
    return `O arquivo passa do limite de ${formatFileSize(
      MAX_RECEIPT_SIZE_BYTES
    )}.`
  }

  return null
}
