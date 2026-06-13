<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

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
  <header class="h-[60px] bg-white dark:bg-[#13111A] border-b border-black/[0.09] dark:border-white/[0.05] flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-200">
    <!-- Left: hamburger + title -->
    <div class="flex items-center gap-4">
      <button
        class="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors text-gray-600 dark:text-gray-400"
        @click="emit('toggleSidebar')"
        aria-label="Abrir menú"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight text-base">{{ sectionTitle }}</h1>
    </div>

    <!-- Right: dark mode + avatar + name + logout -->
    <div class="flex items-center gap-3">
      <!-- Dark mode toggle button -->
      <button
        @click="themeStore.toggleTheme"
        class="p-2 rounded-lg text-[#87858F] hover:text-[#2C2C2A] dark:hover:text-[#E2DFF0] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
        aria-label="Alternar modo oscuro"
      >
        <!-- Sun icon (shown in dark mode) -->
        <svg v-if="themeStore.isDark" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <div class="hidden sm:flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-lila-dark flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs font-semibold">JL</span>
        </div>
        <div class="hidden md:block">
          <p class="text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] leading-tight">Joselyn Li</p>
          <p class="text-xs text-[#87858F] dark:text-[#9A95B0]">Administradora</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="hidden sm:flex items-center gap-1.5 text-xs text-[#87858F] dark:text-[#9A95B0] hover:text-[#2C2C2A] dark:hover:text-[#E2DFF0] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  </header>
</template>
