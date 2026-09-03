import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import Icon from '../Icon/Icon'

import { styles } from './PopupMenu.styles'
import type { PopupMenuProps } from './PopupMenu.types'

export default function PopupMenu({
  items,
  align = 'right',
  trigger = 'kebab',
  style,
}: PopupMenuProps) {
  const [open, setOpen] = useState(false)

  const handleItemPress = (onClick: () => void) => {
    setOpen(false)
    onClick()
  }

  return (
    <View style={[styles.root, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ações"
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.kebab, pressed && styles.kebabPressed]}
      >
        <Icon name="more-vert" size={22} color="rgba(2, 77, 96, 0.95)" />
      </Pressable>

      {open ? (
        <View
          style={[styles.menu, align === 'left' ? styles.left : styles.right]}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="menuitem"
              onPress={() => handleItemPress(item.onClick)}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  )
}
