<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

defineProps<{ title?: string }>()
const emit = defineEmits<{ toggleSidebar: [] }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { show } = useToast()

const sectionTitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/postres': 'Gestión de Postres',
    '/ventas': 'Registro de Ventas',
    '/resumen': 'Resumen Mensual',
  }
  return map[route.path] ?? 'Dashboard'
})

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch {
    show('Error al cerrar sesión', 'error')
  }
}
</script>

<template>
  <header class="h-[60px] bg-white border-b border-black/[0.09] flex items-center justify-between px-6 flex-shrink-0">
    <!-- Left: hamburger + title -->
    <div class="flex items-center gap-4">
      <button
        class="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        @click="emit('toggleSidebar')"
        aria-label="Abrir menú"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="font-semibold text-[#2C2C2A] tracking-tight text-base">{{ sectionTitle }}</h1>
    </div>

    <!-- Right: avatar + name + logout -->
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-lila-dark flex items-center justify-center">
          <span class="text-white text-xs font-semibold">JL</span>
        </div>
        <div class="hidden md:block">
          <p class="text-sm font-medium text-[#2C2C2A] leading-tight">Joselyn Li</p>
          <p class="text-xs text-[#87858F]">Administradora</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="hidden sm:flex items-center gap-1.5 text-xs text-[#87858F] hover:text-[#2C2C2A] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  </header>
</template>
