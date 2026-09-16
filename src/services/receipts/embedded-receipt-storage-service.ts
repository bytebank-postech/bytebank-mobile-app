import { readAsStringAsync } from 'expo-file-system/legacy'

import type { TransactionReceipt } from '@/shared/types/transaction'

import type {
  ReceiptStorageService,
  UploadReceiptParams,
} from './receipt-storage-service.types'

const DATA_URI_PREFIX = 'data:'

const READ_ERROR = 'Não foi possível ler o arquivo escolhido.'

let idCounter = 0

const nextId = () => {
  idCounter += 1
  return `receipt-${Date.now()}-${idCounter}`
}

const toBase64Content = async (uri: string) => {
  if (uri.startsWith(DATA_URI_PREFIX)) {
    const [, content] = uri.split(',')
    return content ?? ''
  }

  return readAsStringAsync(uri, { encoding: 'base64' })
}

const upload = async ({
  userId,
  file,
  onProgress,
}: UploadReceiptParams): Promise<TransactionReceipt> => {
  const content = await toBase64Content(file.uri)

  if (!content) throw new Error(READ_ERROR)

  onProgress?.(100)

  const id = nextId()

  return {
    id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    storagePath: `receipts/${userId}/${id}`,
    downloadURL: `${DATA_URI_PREFIX}${file.mimeType};base64,${content}`,
  }
}

const remove = async (): Promise<void> => {}

export const embeddedReceiptStorageService: ReceiptStorageService = {
  upload,
  remove,
}
