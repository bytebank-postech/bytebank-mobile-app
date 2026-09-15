import { embeddedReceiptStorageService } from './embedded-receipt-storage-service'
import type { ReceiptStorageService } from './receipt-storage-service.types'

export const receiptStorageService: ReceiptStorageService =
  embeddedReceiptStorageService

export { pickReceiptFile } from './receipt-picker'
export type { ReceiptStorageService } from './receipt-storage-service.types'
