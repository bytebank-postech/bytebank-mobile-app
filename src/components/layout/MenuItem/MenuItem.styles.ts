import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  menuItem: {
    position: 'relative',
    padding: 0,
    alignItems: 'center',
  },

  link: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,

    justifyContent: 'center',
    alignItems: 'center',

    color: colors.primary,
  },

  divider: {
    position: 'absolute',

    bottom: 0,

    width: '62%',
    height: 1,

    backgroundColor: 'rgba(0, 77, 97, 0.35)',
  },
})
