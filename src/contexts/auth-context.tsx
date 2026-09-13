import { createContext, useContext, type ReactNode } from 'react'

import { MOCK_USER_ID } from '@/shared/constants/auth'

type AuthContextValue = {
  userId: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={{ userId: MOCK_USER_ID }}>
    {children}
  </AuthContext.Provider>
)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>.')
  }

  return context
}
