import { ReactNode } from 'react'
import { StyleProp, TextStyle } from 'react-native'

export type Variant =
  | 'body'
  | 'body-bold'
  | 'body-sm'
  | 'body-lg'
  | 'title-lg'
  | 'title'
  | 'title-sm'

export type TypographyColor =
  'active' | 'white' | 'error' | 'disabled' | 'placeholder'

export type TypographyWeight = 'normal' | 'bold'

export type TypographyProps = {
  children: ReactNode
  variant?: Variant
  weight?: TypographyWeight
  color?: TypographyColor
  style?: StyleProp<TextStyle>
}
