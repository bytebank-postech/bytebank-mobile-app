import { View } from 'react-native'

import { styles } from './Paper.styles'
import { PaperProps } from './Paper.types'

export default function Paper({
  children,
  style,
  color = 'white',
}: PaperProps) {
  const backgroundStyle = {
    white: undefined,
    primary: styles.bgPrimary,
    gray: styles.bgGray,
  }[color]

  return <View style={[styles.paper, backgroundStyle, style]}>{children}</View>
}
