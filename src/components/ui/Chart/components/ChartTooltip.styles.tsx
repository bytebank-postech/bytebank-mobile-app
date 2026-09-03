import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'
import { theme } from '@/styles/variables'

export const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: theme.radius.input,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  tooltipLabel: {
    marginBottom: 8,
  },

  tooltipList: {
    gap: 4,
  },

  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },

  tooltipName: {
    color: colors.typographyPlaceholder,
  },

  tooltipValue: {
    marginLeft: 'auto',
  },
})
