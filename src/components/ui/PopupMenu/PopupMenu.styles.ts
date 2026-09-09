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

  menu: {
    position: 'absolute',

    top: '100%',
    marginTop: 4,

    minWidth: 160,

    backgroundColor: colors.white,

    borderWidth: 1,
    borderColor: 'rgba(0, 77, 97, 0.25)',
    borderRadius: 8,

    overflow: 'hidden',

    zIndex: 30,

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 11,
  },

  right: {
    right: 0,
  },

  left: {
    left: 0,
  },

  item: {
    width: '100%',

    paddingVertical: 10,
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
