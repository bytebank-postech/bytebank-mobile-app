import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    flexShrink: 1,
  },
  content: {
    width: '100%',
    gap: 16,
    paddingBottom: 8,
  },
  title: {
    paddingRight: 40,
  },
  receipt: {
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 6,
    backgroundColor: colors.gray,
  },
  previewFallback: {
    width: '100%',
    height: 220,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: colors.gray,
  },
  info: {
    gap: 2,
  },
})
