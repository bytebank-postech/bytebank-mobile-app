import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    flexShrink: 1,
  },
  form: {
    width: '100%',
    gap: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
    paddingRight: 40,
  },
  fieldOnWhite: {
    backgroundColor: colors.white,
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  directionButton: {
    flex: 1,
  },
  submitError: {
    marginTop: -4,
  },
})
