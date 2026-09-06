import { TextInput } from 'react-native'

import { colors } from '@/styles/colors'
import { styles } from './Input.styles'
import type { InputProps } from './Input.types'

export default function Input({
  paddingSize = 'medium',
  variant = 'default',
  fullWidth = false,
  editable = true,
  placeholderTextColor,
  style,
  ...props
}: InputProps) {
  return (
    <TextInput
      {...props}
      editable={editable}
      placeholderTextColor={
        placeholderTextColor ?? colors.typographyPlaceholder
      }
      style={[
        styles.input,
        styles[paddingSize],
        styles[variant],
        fullWidth && styles.fullWidth,
        !editable && styles.disabled,
        style,
      ]}
    />
  )
}
