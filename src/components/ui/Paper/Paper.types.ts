import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type PaperProps = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  color?: 'white' | 'primary' | 'gray'
}
