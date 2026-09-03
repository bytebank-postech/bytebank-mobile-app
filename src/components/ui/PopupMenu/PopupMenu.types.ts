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
  style?: StyleProp<ViewStyle>
}
