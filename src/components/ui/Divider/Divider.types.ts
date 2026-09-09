import { StyleProp, ViewStyle } from 'react-native'

export type DividerProps = {
  orientacao: 'horizontal' | 'vertical'
  espessura?: 'fino' | 'medio' | 'grosso'
  color?: 'white' | 'primary' | 'secondary' | 'gray'
  style?: StyleProp<ViewStyle>
}
