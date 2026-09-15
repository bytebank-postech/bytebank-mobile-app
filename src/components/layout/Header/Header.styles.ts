import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'
import { theme } from '@/styles/variables'

export const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.headerPaddingVertical,
    maxHeight: theme.sizes.headerHeight,
  },

  content: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 30,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 6,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  logoutButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
})
