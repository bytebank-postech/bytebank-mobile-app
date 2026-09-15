import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'
import { theme } from '@/styles/variables'

export const styles = StyleSheet.create({
  avatar: {
    padding: theme.spacing.avatarPadding,
    borderRadius: theme.radius.avatar,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
