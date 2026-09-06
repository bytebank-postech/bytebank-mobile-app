import { StyleSheet } from 'react-native'
import { colors } from '../../../styles/colors'
export const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  fullwidth: {
    width: '100%',
  },

  input: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 2,
    backgroundColor: colors.white,
  },

  inputChecked: {
    backgroundColor: colors.primary,
  },

  inputRadio: {
    borderRadius: 8,
  },

  inputDisabled: {
    borderColor: colors.disabledColor,
    opacity: 0.8,
  },

  checkmark: {
    width: 8,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.white,
    transform: [{ translateY: -1 }, { rotate: '-45deg' }],
  },
})
