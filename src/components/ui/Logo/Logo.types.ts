import { theme } from '@/styles/variables'

export type LogoColor = 'primary' | 'secondary' | 'tertiary'

export const logoColors: Record<LogoColor, string> = {
  primary: theme.colors.blue,
  secondary: theme.colors.orange,
  tertiary: theme.colors.grey,
}

export type LogoProps = {
  color?: LogoColor
  height?: number
}

export type LogoIconProps = {
  color?: LogoColor | string
  size?: number
}
