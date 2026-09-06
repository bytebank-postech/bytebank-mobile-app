import { StyleSheet } from 'react-native'


export const styles = StyleSheet.create({
  formInner: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
  },

  formTitle: {
    marginBottom: 4,
  },

  fieldGroup: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },

  labelMuted: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255, 255, 255, 0.88)',
  },

  formSelect: {
    width: 320,
    maxWidth: '100%',
  },

  formDescriptionInput: {
    width: 320,
    maxWidth: '100%',
  },

  formValueInput: {
    width: 180,
    maxWidth: '100%',
  },

  formError: {
    marginTop: -4,
  },

  formSubmit: {
    width: 220,
    maxWidth: '100%',
  },
})
