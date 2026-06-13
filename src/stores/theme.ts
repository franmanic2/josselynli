import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function initTheme() {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      isDark.value = false
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      isDark.value = true
    }
  }

  return { isDark, initTheme, toggleTheme }
})
