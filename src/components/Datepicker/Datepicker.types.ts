import type { StyleProp, ViewStyle } from 'react-native'

export type DatepickerProps = {
  id?: string
  label?: string
  inline?: boolean
  paddingSize?: 'medium' | 'large'
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  fullWidth?: boolean
  disabled?: boolean
  value?: string
  placeholder?: string
  minimumDate?: Date
  maximumDate?: Date
  style?: StyleProp<ViewStyle>
  onChange?: (date: Date) => void
}
