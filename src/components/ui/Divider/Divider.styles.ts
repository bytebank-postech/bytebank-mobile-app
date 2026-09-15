import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.white,
  },

  horizontal: {
    width: '100%',
  },

  vertical: {
    height: '100%',
  },

  finoHorizontal: {
    height: 1,
  },

  medioHorizontal: {
    height: 2,
  },

  grossoHorizontal: {
    height: 4,
  },

  finoVertical: {
    width: 1,
  },

  medioVertical: {
    width: 2,
  },

  grossoVertical: {
    width: 4,
  },

  white: {
    backgroundColor: colors.white,
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.secondary,
  },

  gray: {
    backgroundColor: colors.gray,
  },
})
