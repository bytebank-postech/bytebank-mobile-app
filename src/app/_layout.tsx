import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { AuthProvider } from '@/contexts/auth-context'
import { TransactionsProvider } from '@/contexts/transactions-context'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <AuthProvider>
      <TransactionsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="home" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="transactions" />
        </Stack>
      </TransactionsProvider>
    </AuthProvider>
  )
}
