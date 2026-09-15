import { useRef, useState } from 'react'
import {
  Modal as RNModal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import Icon from '../Icon/Icon'

import { styles } from './PopupMenu.styles'
import type { PopupMenuProps } from './PopupMenu.types'

const ITEM_HEIGHT = 44
const MENU_GAP = 4
const SCREEN_MARGIN = 16

type Anchor = {
  x: number
  y: number
  width: number
  height: number
}

export default function PopupMenu({
  items,
  align = 'right',
  children,
  style,
}: PopupMenuProps) {
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const rootRef = useRef<View>(null)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const isOpen = anchor !== null

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

  const handleItemPress = (onClick: () => void) => {
    handleClose()
    onClick()
  }

  const buildMenuPosition = (measured: Anchor) => {
    const menuHeight = items.length * ITEM_HEIGHT
    const below = measured.y + measured.height + MENU_GAP

    const fitsBelow = below + menuHeight < windowHeight - SCREEN_MARGIN

    return {
      top: fitsBelow ? below : measured.y - MENU_GAP - menuHeight,
      ...(align === 'right'
        ? { right: windowWidth - (measured.x + measured.width) }
        : { left: measured.x }),
    }
  }

  return (
    <View ref={rootRef} style={[styles.root, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ações"
        accessibilityState={{ expanded: isOpen }}
        hitSlop={8}
        onPress={handleToggle}
        style={({ pressed }) => [
          children ? styles.trigger : styles.kebab,
          pressed && styles.kebabPressed,
        ]}
      >
        {children ?? (
          <Icon name="more-vert" size={22} color="rgba(2, 77, 96, 0.95)" />
        )}
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
            accessibilityLabel="Fechar menu"
            onPress={handleClose}
            style={styles.backdrop}
          />

          <View style={[styles.menu, buildMenuPosition(anchor)]}>
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
        </RNModal>
      ) : null}
    </View>
  )
}
