import type { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Logo, Typography } from '@/components/ui'
import { MaxContentWidth, Spacing } from '@/constants/theme'
import { colors } from '@/styles/colors'
import { theme } from '@/styles/variables'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brand}>
              <Logo color="tertiary" height={36} />
            </View>

            <View style={styles.card}>
              <View style={styles.header}>
                <Typography variant="title-lg" style={styles.title}>
                  {title}
                </Typography>
                <Typography variant="body" style={styles.subtitle}>
                  {subtitle}
                </Typography>
              </View>

              <View style={styles.form}>{children}</View>
            </View>

            <View style={styles.footer}>{footer}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.button,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    color: theme.colors.orange,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    color: theme.colors.orange,
    opacity: 0.65,
  },
  form: {
    gap: Spacing.three,
  },
  footer: {
    alignItems: 'center',
  },
})
