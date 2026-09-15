import { View } from 'react-native'

import Icon from '@/components/ui/Icon/Icon'
import { colors } from '@/styles/colors'
import { styles } from './Avatar.styles'
export default function Avatar() {
  return (
    <View style={styles.avatar}>
      <Icon name="person-outline" size={24} color={colors.secondary} />
    </View>
  )
}
