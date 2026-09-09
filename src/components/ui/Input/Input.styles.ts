import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderWidth: 0,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
  },

  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  fullWidth: {
    width: '100%',
  },

  default: {
    borderWidth: 2,
    borderColor: colors.primary,
    color: colors.primary,
  },

  secondary: {
    borderWidth: 2,
    borderColor: colors.secondary,
    color: colors.secondary,
  },

  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
  },

  ghost: {
    backgroundColor: colors.tertiary,
    color: colors.typographyActive,
  },

  disabled: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: colors.disabledColor,
  },
})
