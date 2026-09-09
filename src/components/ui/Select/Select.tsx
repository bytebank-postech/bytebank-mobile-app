import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { styles } from './Select.styles'
import type { SelectProps } from './Select.types'

export default function Select({
  options,
  placeholder = 'Selecione uma opção...',
  disabled = false,
  style,
  value,
  defaultValue,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  const currentValue = value ?? internalValue

  const selected =
    options.find((option) => option.value === currentValue) ?? null

  const isPlaceholder = !selected

  function commit(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  function handleOptionPress(nextValue: string) {
    commit(nextValue)
    setOpen(false)
  }

  return (
    <View style={[styles.select, disabled && styles.disabled, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        accessibilityState={{
          disabled,
          expanded: open,
        }}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={({ pressed }) => [
          styles.trigger,
          open && styles.triggerOpen,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.triggerText,
            isPlaceholder && styles.placeholder,
            disabled && styles.disabledText,
          ]}
        >
          {selected?.label ?? placeholder}
        </Text>

        <View style={styles.caret} accessible={false} />
      </Pressable>

      {open ? (
        <View style={styles.menu} accessibilityLabel="Opções">
          {options.map((option) => {
            const isSelected = option.value === currentValue

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{
                  checked: isSelected,
                }}
                onPress={() => handleOptionPress(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionSelectedText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      ) : null}
    </View>
  )
}
