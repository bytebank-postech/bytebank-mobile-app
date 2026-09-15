import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type FadeInViewProps = PropsWithChildren<{
  delay?: number
  style?: StyleProp<ViewStyle>
}>
