import { View } from 'react-native'

import { styles } from './Divider.styles'
import { DividerProps } from './Divider.types'

export default function Divider({
  orientacao,
  espessura = 'medio',
  color = 'white',
  style,
}: DividerProps) {
  const thicknessStyle =
    orientacao === 'horizontal'
      ? styles[`${espessura}Horizontal`]
      : styles[`${espessura}Vertical`]

  return (
    <View
      style={[
        styles.divider,
        styles[orientacao],
        thicknessStyle,
        styles[color],
        style,
      ]}
    />
  )
}
