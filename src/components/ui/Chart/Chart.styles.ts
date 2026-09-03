import { colors } from '@/styles/colors'
import { theme } from '@/styles/variables'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  chart: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },

  title: {
    textAlign: 'center',
  },

  canvas: {
    width: '100%',
    minHeight: 280,
  },

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
    fontSize: 14,
    fontWeight: '600',
    color: colors.typographyActive,
  },

  tooltipList: {
    flexDirection: 'column',
    gap: 4,
  },

  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: colors.typographyPlaceholder,
  },

  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },

  tooltipValue: {
    marginLeft: 'auto',
    fontWeight: '600',
    color: colors.typographyActive,
  },
})
