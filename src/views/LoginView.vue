<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { show } = useToast()

const usuario = ref('')
const password = ref('')
const loading = ref(false)

function resolveEmail(input: string): string {
  const trimmed = input.trim()
  return trimmed.includes('@') ? trimmed : `${trimmed}@josselynli.com`
}

async function handleLogin() {
  if (!usuario.value || !password.value) {
    show('Completa todos los campos', 'error')
    return
  }
  loading.value = true
  try {
    await authStore.login(resolveEmail(usuario.value), password.value)
    router.push('/')
  } catch {
    show('Credenciales incorrectas. Intenta de nuevo.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF9FC] flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-lila-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-xl">JL</span>
        </div>
        <h1 class="text-2xl font-semibold text-[#2C2C2A] tracking-tight">Joselyn Li</h1>
        <p class="text-sm text-[#87858F] mt-1">Panel de Administración</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl border border-black/[0.09] shadow-sm p-6">
        <h2 class="font-semibold text-[#2C2C2A] mb-5 tracking-tight">Iniciar sesión</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">Usuario</label>
            <input
              v-model="usuario"
              type="text"
              placeholder="admin"
              autocomplete="username"
              class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">Contraseña</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 rounded-md bg-lila-dark text-white text-sm font-medium hover:bg-lila-hover transition-colors disabled:opacity-60 mt-2"
          >
            {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
