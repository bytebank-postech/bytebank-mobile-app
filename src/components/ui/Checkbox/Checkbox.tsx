import { useState } from 'react'
import { Pressable, View } from 'react-native'
import Typography from '../Typography/Typography'
import { styles } from './Checkbox.styles'

import { CheckboxProps } from './Checkbox.types'

export default function Checkbox({
  type,
  label,
  value,
  id,
  onChange,
  disabled,
  fullWidth,
}: CheckboxProps) {
  const [checked, setChecked] = useState(false)

  const handlePress = () => {
    if (disabled) return

    onChange?.(value)
    setChecked((currentChecked) => !currentChecked)
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={type}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      testID={id}
      style={[styles.checkbox, fullWidth && styles.fullwidth]}
    >
      <View
        style={[
          styles.input,
          type === 'radio' && styles.inputRadio,
          checked && styles.inputChecked,
          disabled && styles.inputDisabled,
        ]}
      >
        {checked ? <View style={styles.checkmark} /> : null}
      </View>
      {label ? <Typography>{label}</Typography> : null}
    </Pressable>
  )
}
