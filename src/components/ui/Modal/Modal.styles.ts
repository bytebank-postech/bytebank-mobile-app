import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modal: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '100%',

    padding: 32,

    borderRadius: 10,

    backgroundColor: colors.gray,

    overflow: 'hidden',
  },

  close: {
    position: 'absolute',

    top: 10,
    right: 10,

    width: 44,
    height: 44,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 22,
    backgroundColor: 'transparent',

    zIndex: 10,
  },

  closePressed: {
    opacity: 0.8,
  },

  decorationTop: {
    position: 'absolute',
    top: 0,
    right: 0,

    width: 120,
    height: 120,

    opacity: 0.25,
  },

  decorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width: 120,
    height: 120,

    opacity: 0.2,
  },

  content: {
    zIndex: 1,
  },
})
