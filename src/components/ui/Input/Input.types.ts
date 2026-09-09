import type { StyleProp, TextInputProps, TextStyle } from 'react-native'

export type InputProps = {
  paddingSize?: 'medium' | 'large'
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  fullWidth?: boolean
  style?: StyleProp<TextStyle>
} & TextInputProps
