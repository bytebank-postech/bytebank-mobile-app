import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp, getApps, getApp } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { Platform } from 'react-native'

type ReactNativeAuthModule = {
  getReactNativePersistence: (storage: unknown) => firebaseAuth.Persistence
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

function createAuth(): firebaseAuth.Auth {
  try {
    if (Platform.OS === 'web') {
      return firebaseAuth.initializeAuth(app, {
        persistence: firebaseAuth.browserLocalPersistence,
      })
    }

    // getReactNativePersistence só existe na build nativa do SDK.
    const { getReactNativePersistence } =
      firebaseAuth as unknown as ReactNativeAuthModule

    return firebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  } catch {
    return firebaseAuth.getAuth(app)
  }
}

export const firebaseApp = app
export const auth = createAuth()
export const db = getFirestore(app)
