import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function login(email: string, password: string) {
    await setPersistence(auth, browserLocalPersistence)
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    user.value = null
    await signOut(auth)
  }

  function init(): Promise<void> {
    return new Promise((resolve) => {
      // El listener se mantiene vivo toda la sesión para detectar login/logout
      onAuthStateChanged(auth, (u) => {
        user.value = u
        loading.value = false
        resolve()
      })
    })
  }

  return { user, loading, login, logout, init }
})
