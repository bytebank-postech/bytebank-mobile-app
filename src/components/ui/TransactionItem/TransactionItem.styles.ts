import { StyleSheet } from 'react-native'

import { colors } from '../../../styles/colors'

export const styles = StyleSheet.create({
  transactionItem: {
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 77, 97, 0.12)',
  },

  selectable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  body: {
    flex: 1,
    minWidth: 0,
  },

  checkboxWrapper: {
    width: 18,
    height: 18,

    justifyContent: 'center',
    alignItems: 'center',

    position: 'relative',

    flexShrink: 0,
  },

  checkboxBox: {
    width: 16,
    height: 16,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 2,

    backgroundColor: colors.white,
  },

  checkboxBoxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  checkmark: {
    width: 8,
    height: 5,

    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.white,

    transform: [{ translateY: -1 }, { rotate: '-45deg' }],
  },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },

  leftStack: {
    flexDirection: 'column',
    gap: 2,
  },

  rightTop: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },

  kebabWrapper: {
    marginTop: 2,
  },

  inlineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  typeText: {
    color: colors.primary,
  },

  dateText: {
    color: colors.typographyActive,
    flexShrink: 0,
  },

  nameText: {
    color: colors.typographyActive,
    marginBottom: 4,
    marginRight: 4,
  },

  amount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 24,
  },

  amountPositive: {
    color: colors.success,
  },

  amountNegative: {
    color: colors.secondary,
  },
})
