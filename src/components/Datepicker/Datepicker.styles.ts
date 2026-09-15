import { StyleSheet } from 'react-native'
import { colors } from '../../styles/colors'
export const styles = StyleSheet.create({
  datepicker: {
    width: '100%',
    gap: 8,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.typographyDefault,
  },
  input: {
    borderRadius: 8,
    borderWidth: 2,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.primary,
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  fullwidth: {
    width: '100%',
  },
  default: {
    borderColor: colors.primary,
  },
  secondary: {
    borderColor: colors.secondary,
    color: colors.secondary,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  ghost: {
    borderWidth: 0,
    backgroundColor: colors.tertiary,
    color: colors.typographyActive,
  },
  disabled: {
    opacity: 0.8,
    borderColor: colors.disabledColor,
  },
  placeholder: {
    color: colors.typographyPlaceholder,
  },
})
