import type {
  PickedReceiptFile,
  TransactionReceipt,
} from '@/shared/types/transaction'
import { formatFileSize } from '@/shared/utils/file'

export const MAX_RECEIPT_SIZE_BYTES = 700 * 1024

export const MAX_RECEIPTS_TOTAL_BYTES = 700 * 1024

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const isAllowedMimeType = (mimeType: string) =>
  ALLOWED_RECEIPT_MIME_TYPES.some((allowed) => allowed === mimeType)

const buildTotalSizeError = () => {
  const limit = formatFileSize(MAX_RECEIPTS_TOTAL_BYTES)

  return `Os recibos desta transação somam mais que o limite de ${limit}.`
}

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

export const validateReceiptAddition = (
  file: PickedReceiptFile,
  receipts: TransactionReceipt[]
): string | null => {
  const fileError = validateReceiptFile(file)

  if (fileError) return fileError

  const attachedSize = receipts.reduce(
    (total, receipt) => total + receipt.size,
    0
  )

  if (attachedSize + file.size > MAX_RECEIPTS_TOTAL_BYTES) {
    return buildTotalSizeError()
  }

  return null
}
