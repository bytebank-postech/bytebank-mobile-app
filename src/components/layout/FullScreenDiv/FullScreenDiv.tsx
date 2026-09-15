import { View } from 'react-native'

import { styles } from './FullScreenDiv.styles'

type FullScreenDivProps = {
  children: React.ReactNode
}

export default function FullScreenDiv({ children }: FullScreenDivProps) {
  return <View style={styles.fullscreen}>{children}</View>
}
