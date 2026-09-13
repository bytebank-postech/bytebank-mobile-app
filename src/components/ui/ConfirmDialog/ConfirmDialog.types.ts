export type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  pendingLabel: string
  onConfirm: () => Promise<void>
  onClose: () => void
}
