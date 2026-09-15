import { useEffect, useState } from 'react'
import { Animated } from 'react-native'

import { styles } from './FadeInView.styles'
import type { FadeInViewProps } from './FadeInView.types'

const DURATION_MS = 400
const OFFSET = 16

export default function FadeInView({
  children,
  delay = 0,
  style,
}: FadeInViewProps) {
  const [progress] = useState(() => new Animated.Value(0))

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION_MS,
      delay,
      useNativeDriver: true,
    })

    animation.start()

    return () => animation.stop()
  }, [delay, progress])

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [OFFSET, 0],
  })

  return (
    <Animated.View
      style={[
        styles.view,
        style,
        { opacity: progress, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  )
}
