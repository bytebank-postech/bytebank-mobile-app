import { Link, Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button, Input, Typography } from '@/components/ui'
import { Spacing } from '@/constants/theme'
import { useAuth } from '@/contexts/auth-context'
import { theme } from '@/styles/variables'

export default function LoginScreen() {
  const router = useRouter()
  const { user, isLoading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && user) {
    return <Redirect href="/home" />
  }

  async function handleLogin() {
    setError('')

    if (!email.trim() || !senha) {
      setError('Preencha e-mail e senha.')
      return
    }

    setSubmitting(true)

    try {
      await signIn({ email, password: senha })
      router.replace('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse sua conta ByteBank"
      footer={
        <Link href="/cadastro" asChild>
          <Pressable style={styles.footerLink}>
            <Typography variant="body-sm" color="disabled">
              Não tem uma conta?
            </Typography>
            <Typography variant="body-sm" style={styles.footerAction}>
              Criar conta
            </Typography>
          </Pressable>
        </Link>
      }
    >
      <View style={styles.field}>
        <Typography variant="title" color="active">
          E-mail
        </Typography>
        <Input
          fullWidth
          paddingSize="large"
          placeholder="Digite seu e-mail"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          editable={!submitting}
        />
      </View>

      <View style={styles.field}>
        <Typography variant="title" color="active">
          Senha
        </Typography>
        <Input
          fullWidth
          paddingSize="large"
          placeholder="Digite sua senha"
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          value={senha}
          onChangeText={setSenha}
          editable={!submitting}
        />
      </View>

      {error ? (
        <Typography variant="body-sm" color="error">
          {error}
        </Typography>
      ) : null}

      <Button
        fullWidth
        size="large"
        disabled={submitting}
        onPress={handleLogin}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : 'Entrar'}
      </Button>
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
    width: '100%',
  },
  footerLink: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  footerAction: {
    color: theme.colors.orange,
    fontFamily: 'Inter_600SemiBold',
  },
})
