import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})
