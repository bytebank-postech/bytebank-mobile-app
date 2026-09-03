import type { StyleProp, ViewStyle } from 'react-native'

export type TransactionMenuItem = {
  id: string
  label: string
  onClick: () => void
}

export type MenuPlacement = 'under-date' | 'home-stacked-date' | 'inline-right'

export type TransactionItemProps = {
  type: string
  name?: string
  amount: number
  date: string
  menuItems?: TransactionMenuItem[]
  menuPlacement?: MenuPlacement
  selectable?: boolean
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  style?: StyleProp<ViewStyle>
}
