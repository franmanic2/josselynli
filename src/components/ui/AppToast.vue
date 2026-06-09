<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[240px] max-w-[360px] cursor-pointer"
        :class="{
          'bg-white border border-[#E6F2E9] text-[#4A8A5E]': toast.type === 'success',
          'bg-white border border-[#FBEDED] text-[#C97C7C]': toast.type === 'error',
          'bg-white border border-lila-tint2 text-lila-dark': toast.type === 'info',
        }"
        @click="remove(toast.id)"
        style="will-change: transform"
      >
        <!-- Icon -->
        <svg v-if="toast.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="toast.type === 'error'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
