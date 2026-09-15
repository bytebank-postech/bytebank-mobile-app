import { Text, type StyleProp, type TextStyle } from 'react-native'

import { TypographyProps } from './Typography.types'

import { styles } from './Typography.styles'

export default function Typography({
  children,
  variant = 'body',
  weight = 'normal',
  color,
  style,
}: TypographyProps & {
  style?: StyleProp<TextStyle>
}) {
  return (
    <Text
      style={[
        styles[variant],
        styles[weight],
        color && styles[`${color}Color`],
        style,
      ]}
    >
      {children}
    </Text>
  )
}
