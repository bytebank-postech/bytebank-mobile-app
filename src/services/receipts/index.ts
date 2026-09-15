import { mockReceiptStorageService } from './mock-receipt-storage-service'
import type { ReceiptStorageService } from './receipt-storage-service.types'

export const receiptStorageService: ReceiptStorageService =
  mockReceiptStorageService

export { pickReceiptFile } from './receipt-picker'
export type { ReceiptStorageService } from './receipt-storage-service.types'
