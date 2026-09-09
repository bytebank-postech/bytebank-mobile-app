import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type PopupMenuItem = {
  id: string
  label: string
  onClick: () => void
}

export type PopupMenuProps = {
  items: PopupMenuItem[]
  align?: 'left' | 'right'
  trigger?: 'kebab' | 'button'
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}
