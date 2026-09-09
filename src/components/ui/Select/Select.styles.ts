import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  select: {
    width: '100%',
    position: 'relative',
  },

  trigger: {
    width: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },

  triggerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },

  triggerText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400',
    color: colors.primary,
  },

  placeholder: {
    color: colors.typographyPlaceholder,
  },

  caret: {
    width: 0,
    height: 0,
    marginLeft: 8,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },

  menu: {
    position: 'absolute',
    left: 0,
    top: 42,
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    zIndex: 20,
    elevation: 8,
  },

  option: {
    width: '100%',
    height: 28,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400',
    color: colors.typographyActive,
  },

  optionSelected: {
    backgroundColor: '#dce7e8',
  },

  optionSelectedText: {
    fontFamily: 'Inter_700Bold',
  },

  disabled: {
    opacity: 0.8,
  },

  disabledText: {
    color: '#999',
  },

  pressed: {
    opacity: 0.8,
  },
})
