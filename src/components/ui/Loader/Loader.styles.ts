import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  loader: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {
    width: 50,
    height: 50,

    borderWidth: 5,
    borderColor: colors.white,
    borderTopColor: colors.primary,

    borderRadius: 25,
  },
})
