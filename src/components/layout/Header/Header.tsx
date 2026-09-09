import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { Typography } from '../../ui'
import Avatar from '../Avatar/Avatar'

import { styles } from './Header.styles'

type AuthUser = {
  name: string
}

export default function Header() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/auth/api/session', {
      cache: 'no-store',
    })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.user?.name === 'string') {
          setUser(data.user)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    setUser(null)

    try {
      await fetch('/auth/api/logout', {
        method: 'POST',
        cache: 'no-store',
      })
    } finally {
      router.replace('/auth')
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        {user ? (
          <>
            <Typography color="white">{user.name}</Typography>

            <Avatar />

            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={() => void handleLogout()}
            >
              <Typography color="white">Sair</Typography>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  )
}
