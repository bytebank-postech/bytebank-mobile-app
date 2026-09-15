import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { useAuth } from '@/contexts/auth-context'
import { colors } from '@/styles/colors'

export default function Index() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    )
  }

  return <Redirect href={user ? '/home' : '/login'} />
}
