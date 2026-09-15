import { View } from 'react-native'

import { colors } from '@/styles/colors'

import Icon from '../../ui/Icon/Icon'
import { styles } from './Avatar.styles'

export default function Avatar() {
  return (
    <View style={styles.avatar}>
      <Icon name="person-outline" size={24} color={colors.secondary} />
    </View>
  )
}
