import { Pressable, type PressableProps } from 'react-native'

import Typography from '../Typography/Typography'

import { styles } from './Button.styles'

type ButtonSize = 'medium' | 'large'

type ButtonVariant =
  'default' | 'secondary' | 'outline' | 'ghost' | 'rounded' | 'rounded-outline'

type ButtonProps = PressableProps & {
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  disabled?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
}
const pressedStyles: Record<ButtonVariant, object> = {
  default: styles.defaultPressed,
  secondary: styles.secondaryPressed,
  outline: styles.outlinePressed,
  ghost: styles.ghostPressed,
  rounded: styles.roundedPressed,
  'rounded-outline': styles.roundedOutlinePressed,
}

export default function Button({
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  children,
  icon,
  style,
  ...props
}: ButtonProps) {
  const isRounded = variant === 'rounded' || variant === 'rounded-outline'

  const content = isRounded ? (
    icon
  ) : typeof children === 'string' ? (
    <Typography
      color={variant === 'outline' || variant === 'ghost' ? 'active' : 'white'}
    >
      {children}
    </Typography>
  ) : (
    children
  )

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        styles[variant],
        fullWidth && styles.fullwidth,
        disabled && styles.disabled,
        pressed && !disabled && pressedStyles[variant],
        style,
      ]}
    >
      {content}
    </Pressable>
  )
}
