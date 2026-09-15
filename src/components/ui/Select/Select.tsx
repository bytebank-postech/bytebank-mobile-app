import { useRef, useState } from 'react'
import {
  Modal as RNModal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import { styles } from './Select.styles'
import type { SelectProps } from './Select.types'

const OPTION_HEIGHT = 28
const MENU_BORDER_HEIGHT = 4
const TRIGGER_OVERLAP = 2
const SCREEN_MARGIN = 16

type Anchor = {
  x: number
  y: number
  width: number
  height: number
}

export default function Select({
  options,
  placeholder = 'Selecione uma opção...',
  disabled = false,
  style,
  value,
  defaultValue,
  onChange,
}: SelectProps) {
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  const rootRef = useRef<View>(null)

  const { height: windowHeight } = useWindowDimensions()

  const currentValue = value ?? internalValue

  const selected =
    options.find((option) => option.value === currentValue) ?? null

  const isPlaceholder = !selected

  const isOpen = anchor !== null

  const menuHeight = options.length * OPTION_HEIGHT + MENU_BORDER_HEIGHT

  const fitsBelow = anchor
    ? anchor.y + anchor.height + menuHeight < windowHeight - SCREEN_MARGIN
    : true

  const handleClose = () => {
    setAnchor(null)
  }

  const handleToggle = () => {
    if (isOpen) {
      handleClose()
      return
    }

    rootRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
    })
  }

  const commit = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  const handleOptionPress = (nextValue: string) => {
    handleClose()
    commit(nextValue)
  }

  const buildMenuPosition = (measured: Anchor) => ({
    left: measured.x,
    width: measured.width,
    top: fitsBelow
      ? measured.y + measured.height - TRIGGER_OVERLAP
      : measured.y - menuHeight + TRIGGER_OVERLAP,
  })

  return (
    <View
      ref={rootRef}
      style={[styles.select, disabled && styles.disabled, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        accessibilityState={{
          disabled,
          expanded: isOpen,
        }}
        disabled={disabled}
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.trigger,
          isOpen &&
            (fitsBelow ? styles.triggerOpenBelow : styles.triggerOpenAbove),
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

      {/* No Android, elemento fora dos limites do pai não recebe toque. */}
      {anchor ? (
        <RNModal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={handleClose}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar opções"
            onPress={handleClose}
            style={styles.backdrop}
          />

          <View
            accessibilityLabel="Opções"
            style={[
              styles.menu,
              fitsBelow ? styles.menuBelow : styles.menuAbove,
              buildMenuPosition(anchor),
            ]}
          >
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
        </RNModal>
      ) : null}
    </View>
  )
}
