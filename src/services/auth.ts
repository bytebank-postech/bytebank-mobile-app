import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
} from 'firebase/auth'

import { auth } from './firebase'

export type AuthCredentials = {
  email: string
  password: string
}

export async function signIn({
  email,
  password,
}: AuthCredentials): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function signUp({
  email,
  password,
}: AuthCredentials): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email.trim(), password)
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth)
}

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : null

  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.'
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.'
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso.'
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet.'
    default:
      return 'Não foi possível concluir a autenticação.'
  }
}

export type { User }
