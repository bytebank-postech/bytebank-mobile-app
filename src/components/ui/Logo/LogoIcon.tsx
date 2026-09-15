import Svg, { Rect } from 'react-native-svg'

import { logoColors, type LogoIconProps } from './Logo.types'

export default function LogoIcon({
  color = 'primary',
  size = 32,
}: LogoIconProps) {
  const fill =
    color in logoColors ? logoColors[color as keyof typeof logoColors] : color

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityRole="image"
    >
      <Rect x="0" y="0" width="8" height="8" fill={fill} />
      <Rect x="16" y="0" width="8" height="8" fill={fill} />
      <Rect x="0" y="16" width="8" height="8" fill={fill} />
      <Rect x="8" y="8" width="16" height="16" fill={fill} />
    </Svg>
  )
}
