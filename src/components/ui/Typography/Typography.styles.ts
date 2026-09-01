import { StyleSheet } from 'react-native'

import { colors } from '../../../styles/colors'

export const styles = StyleSheet.create({
  // =========================
  // Body
  // =========================

  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.typographyDefault,
  },

  'body-bold': {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.typographyDefault,
  },

  'body-lg': {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    lineHeight: 30,
    color: colors.typographyDefault,
  },

  'body-sm': {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.typographyDefault,
  },

  // =========================
  // Titles
  // =========================

  'title-lg': {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: colors.typographyDefault,
  },

  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.typographyDefault,
  },

  'title-sm': {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: colors.typographyDefault,
  },

  // =========================
  // Colors
  // =========================

  activeColor: {
    color: colors.typographyActive,
  },

  whiteColor: {
    color: colors.typographySecondary,
  },

  errorColor: {
    color: colors.typographyError,
  },

  disabledColor: {
    color: colors.typographyDisabled,
  },

  placeholderColor: {
    color: colors.typographyPlaceholder,
  },

  // =========================
  // Weights
  // =========================

  normal: {
    fontWeight: '400',
  },

  bold: {
    fontWeight: '600',
  },
})
