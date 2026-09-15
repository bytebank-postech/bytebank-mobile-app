import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type FormFieldProps = {
  label: string
  children: ReactNode
  error?: string
  required?: boolean
  style?: StyleProp<ViewStyle>
}
