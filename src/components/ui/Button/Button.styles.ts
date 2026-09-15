import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  // ========================================
  // Base
  // ========================================

  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // ========================================
  // Sizes
  // ========================================

  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // ========================================
  // Full width
  // ========================================

  fullwidth: {
    width: '100%',
  },

  // ========================================
  // Variants
  // ========================================

  default: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.secondary,
  },

  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  ghost: {
    backgroundColor: colors.tertiary,
  },

  rounded: {
    borderRadius: 999,
    backgroundColor: colors.primary,
  },

  'rounded-outline': {
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  // ========================================
  // Disabled
  // ========================================

  disabled: {
    opacity: 0.5,
  },

  // ========================================
  // Pressed states
  // ========================================

  defaultPressed: {
    backgroundColor: colors.primaryAction,
  },

  secondaryPressed: {
    backgroundColor: colors.secondaryAction,
  },

  outlinePressed: {
    backgroundColor: colors.primary,
  },

  ghostPressed: {
    backgroundColor: colors.tertiaryAction,
  },

  roundedPressed: {
    backgroundColor: colors.primaryAction,
  },

  roundedOutlinePressed: {
    borderColor: colors.primaryAction,
    backgroundColor: colors.primary,
  },

  // ========================================
  // Text
  // ========================================

  text: {
    color: colors.white,
  },

  outlineText: {
    color: colors.primary,
  },

  ghostText: {
    color: colors.typographyActive,
  },

  roundedOutlineText: {
    color: colors.primary,
  },
})
