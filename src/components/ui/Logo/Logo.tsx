import { StyleSheet, Text, View } from 'react-native'

import LogoIcon from './LogoIcon'
import { logoColors, type LogoProps } from './Logo.types'

export default function Logo({ color = 'primary', height = 32 }: LogoProps) {
  const fill = logoColors[color]

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel="Bytebank"
    >
      <LogoIcon color={color} size={height} />
      <Text
        style={[
          styles.wordmark,
          { color: fill, fontSize: height * 0.72, lineHeight: height },
        ]}
      >
        Bytebank
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'italic',
    letterSpacing: -0.3,
  },
})
