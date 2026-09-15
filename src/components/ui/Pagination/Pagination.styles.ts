import { StyleSheet } from 'react-native'
import { colors } from '../../../styles/colors'
export const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginVertical: 20,
  },
  disabled: {
    opacity: 0.75,
  },
  button: {
    minWidth: 40,
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  active: {
    borderWidth: 2,
    borderColor: colors.primaryGhost,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: colors.primaryAction,
  },
  label: {
    color: colors.white,
  },
})
