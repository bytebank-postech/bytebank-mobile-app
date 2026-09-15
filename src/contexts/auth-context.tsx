import { onAuthStateChanged } from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  getAuthErrorMessage,
  type AuthCredentials,
  type User,
} from '@/services/auth'
import { auth } from '@/services/firebase'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: AuthCredentials) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    try {
      await authSignIn(credentials)
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }, [])

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    try {
      await authSignUp(credentials)
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authSignOut()
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
