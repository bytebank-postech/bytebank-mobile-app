import type {
  PickedReceiptFile,
  TransactionReceipt,
} from '@/shared/types/transaction'

export type UploadReceiptParams = {
  userId: string
  file: PickedReceiptFile
  onProgress?: (percent: number) => void
}

export interface ReceiptStorageService {
  upload(params: UploadReceiptParams): Promise<TransactionReceipt>
  remove(storagePath: string): Promise<void>
}
