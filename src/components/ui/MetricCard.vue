<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color?: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-black/[0.09] shadow-sm p-5 flex items-center gap-4">
    <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: color || '#F4EFFA' }">
      <svg class="w-5 h-5" :style="{ color: '#7B5EA7' }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
      </svg>
    </div>
    <div>
      <p class="text-xs text-[#87858F] font-medium mb-0.5">{{ title }}</p>
      <p class="text-2xl font-semibold text-[#2C2C2A] tracking-tight">{{ value }}</p>
    </div>
  </div>
</template>
