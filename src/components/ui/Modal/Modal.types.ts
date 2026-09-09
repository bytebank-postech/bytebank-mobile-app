import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  style?: StyleProp<ViewStyle>
}
