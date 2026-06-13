<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{
  title: string
  value: string | number
  icon: string
  color?: string
}>()

const themeStore = useThemeStore()

const computedBg = computed(() => {
  if (!themeStore.isDark) {
    return props.color || '#F4EFFA'
  }
  // Dark mode background colors
  if (props.color === '#FBF3DE') return 'rgba(251, 243, 222, 0.1)' // Yellow tint
  if (props.color === '#E6F2E9') return 'rgba(230, 242, 233, 0.1)' // Green tint
  return 'rgba(155, 126, 200, 0.15)' // Default purple tint
})

const computedIconColor = computed(() => {
  if (!themeStore.isDark) {
    return '#7B5EA7'
  }
  if (props.color === '#FBF3DE') return '#F5D37F' // Gold icon
  if (props.color === '#E6F2E9') return '#77C18F' // Green icon
  return '#C8B4E3' // Default lila-light icon
})
</script>

<template>
  <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm p-5 flex items-center gap-4 transition-colors duration-200">
    <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200" :style="{ backgroundColor: computedBg }">
      <svg class="w-5 h-5 transition-colors duration-200" :style="{ color: computedIconColor }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
      </svg>
    </div>
    <div>
      <p class="text-xs text-[#87858F] dark:text-[#9A95B0] font-medium mb-0.5">{{ title }}</p>
      <p class="text-2xl font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">{{ value }}</p>
    </div>
  </div>
</template>
