import type { StyleProp, ViewStyle } from 'react-native'

export type Option = {
  label: string
  value: string
}

export type SelectProps = {
  options: Option[]
  placeholder?: string
  disabled?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  style?: StyleProp<ViewStyle>
}
