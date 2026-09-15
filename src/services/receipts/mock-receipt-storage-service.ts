import type { TransactionReceipt } from '@/shared/types/transaction'

import type {
  ReceiptStorageService,
  UploadReceiptParams,
} from './receipt-storage-service.types'

const PROGRESS_STEPS = [20, 55, 85, 100]
const PROGRESS_STEP_DELAY_MS = 180
const REMOVE_DELAY_MS = 400

let idCounter = 0

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const upload = async ({
  userId,
  file,
  onProgress,
}: UploadReceiptParams): Promise<TransactionReceipt> => {
  for (const percent of PROGRESS_STEPS) {
    await delay(PROGRESS_STEP_DELAY_MS)
    onProgress?.(percent)
  }

  idCounter += 1

  const id = `mock-receipt-${idCounter}`
  const storagePath = `receipts/${userId}/${id}-${file.name}`

  return {
    id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    storagePath,
    downloadURL: `https://mock.local/${storagePath}`,
  }
}

const remove = async (): Promise<void> => {
  await delay(REMOVE_DELAY_MS)
}

export const mockReceiptStorageService: ReceiptStorageService = {
  upload,
  remove,
}
