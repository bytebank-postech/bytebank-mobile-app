import { Pressable, Modal as RNModal, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Icon from '../Icon/Icon'

import { styles } from './Modal.styles'
import type { ModalProps } from './Modal.types'

export default function Modal({
  isOpen,
  onClose,
  children,
  style,
}: ModalProps) {
  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, style]}>
          {/* Decoração superior direita */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 128, 96, 0.25)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.decorationTop}
            pointerEvents="none"
          />

          {/* Decoração inferior esquerda */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 128, 96, 0.2)']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.decorationBottom}
            pointerEvents="none"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
            onPress={onClose}
            style={({ pressed }) => [
              styles.close,
              pressed && styles.closePressed,
            ]}
          >
            <Icon name="close" size={32} />
          </Pressable>

          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </RNModal>
  )
}
