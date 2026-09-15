import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  menu: {
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 220,
    height: '100%',
    paddingVertical: 16,
    borderRadius: 8,
  },

  list: {
    width: '100%',
    margin: 0,
    padding: 0,
  },

  divider: {
    width: '62%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 77, 97, 0.35)',
  },
})
