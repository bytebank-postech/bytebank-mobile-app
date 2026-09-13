import { StyleSheet } from 'react-native'

import { colors } from '../../../styles/colors'

export const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignSelf: 'flex-start',
  },

  kebab: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  trigger: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  kebabPressed: {
    opacity: 0.8,
    transform: [{ translateY: 0.5 }],
  },

  backdrop: {
    flex: 1,
  },

  menu: {
    position: 'absolute',

    minWidth: 160,

    backgroundColor: colors.white,

    borderWidth: 1,
    borderColor: 'rgba(0, 77, 97, 0.25)',
    borderRadius: 8,

    overflow: 'hidden',

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 11,
  },

  item: {
    width: '100%',

    minHeight: 44,

    paddingVertical: 12,
    paddingHorizontal: 12,

    justifyContent: 'center',
    alignItems: 'flex-start',

    backgroundColor: 'transparent',
  },

  itemPressed: {
    backgroundColor: '#dce7e8',
  },

  itemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.typographyActive,
  },
})
