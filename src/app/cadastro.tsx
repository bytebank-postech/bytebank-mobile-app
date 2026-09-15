import { Link, Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button, Input, Typography } from '@/components/ui'
import { Spacing } from '@/constants/theme'
import { useAuth } from '@/contexts/auth-context'
import { theme } from '@/styles/variables'

export default function CadastroScreen() {
  const router = useRouter()
  const { user, isLoading, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && user) {
    return <Redirect href="/home" />
  }

  async function handleCadastro() {
    setError('')

    if (!email.trim() || !senha || !confirmarSenha) {
      setError('Preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.')
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setSubmitting(true)

    try {
      await signUp({ email, password: senha })
      router.replace('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Crie sua conta ByteBank"
      footer={
        <Link href="/login" asChild>
          <Pressable style={styles.footerLink}>
            <Typography variant="body-sm" color="disabled">
              Já tem uma conta?
            </Typography>
            <Typography variant="body-sm" style={styles.footerAction}>
              Entrar
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
          textContentType="newPassword"
          autoComplete="password-new"
          value={senha}
          onChangeText={setSenha}
          editable={!submitting}
        />
      </View>

      <View style={styles.field}>
        <Typography variant="title" color="active">
          Confirmar senha
        </Typography>
        <Input
          fullWidth
          paddingSize="large"
          placeholder="Digite a senha novamente"
          secureTextEntry
          textContentType="newPassword"
          autoComplete="password-new"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
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
        onPress={handleCadastro}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : 'Criar conta'}
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
