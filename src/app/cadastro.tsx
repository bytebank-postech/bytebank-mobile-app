import { Link } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button, Input, Typography } from '@/components/ui'
import { Spacing } from '@/constants/theme'
import { theme } from '@/styles/variables'

export default function CadastroScreen() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

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
          Usuário
        </Typography>
        <Input
          fullWidth
          paddingSize="large"
          placeholder="Digite seu usuário"
          autoCapitalize="none"
          autoCorrect={false}
          value={usuario}
          onChangeText={setUsuario}
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
          value={senha}
          onChangeText={setSenha}
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
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
      </View>

      <Button fullWidth size="large" onPress={() => {}}>
        Criar conta
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
