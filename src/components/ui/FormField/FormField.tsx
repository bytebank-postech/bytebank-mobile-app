import { View } from 'react-native'

import Typography from '../Typography/Typography'

import { styles } from './FormField.styles'
import type { FormFieldProps } from './FormField.types'

export default function FormField({
  label,
  children,
  error,
  required = false,
  style,
}: FormFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Typography variant="body-sm" weight="bold" style={styles.label}>
        {required ? `${label} *` : label}
      </Typography>

      {children}

      {error ? (
        <View accessibilityRole="alert" accessibilityLiveRegion="polite">
          <Typography variant="body-sm" color="error">
            {error}
          </Typography>
        </View>
      ) : null}
    </View>
  )
}
