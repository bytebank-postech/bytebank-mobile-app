import { Redirect } from 'expo-router'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Menu } from '@/components/layout'
import { useAuth } from '@/contexts/auth-context'

export default function TransactionScreen() {
  const { user, isLoading } = useAuth()

  if (!isLoading && !user) {
    return <Redirect href="/login" />
  }

  return (
    <SafeAreaView>
      <Menu />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
