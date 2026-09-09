import { ActivityIndicator, View } from 'react-native'

import { styles } from './Loader.styles'

export default function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#004d61" />
    </View>
  )
}
