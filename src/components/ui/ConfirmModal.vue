<script setup lang="ts">
import AppModal from './AppModal.vue'

defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmLabel?: string
  loading?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  confirm: []
}>()
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="400px">
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-[#FBEDED] flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[#C97C7C]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-[#2C2C2A] dark:text-[#E2DFF0] font-semibold mb-1">{{ title || '¿Estás segura?' }}</h3>
          <p class="text-sm text-[#87858F] dark:text-[#9A95B0]">{{ message || 'Esta acción no se puede deshacer.' }}</p>
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="emit('update:modelValue', false)"
          class="px-4 py-2 rounded-md text-sm font-medium text-[#87858F] dark:text-[#9A95B0] hover:bg-gray-50 dark:hover:bg-white/[0.04] border border-black/[0.09] dark:border-white/[0.05] transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="emit('confirm')"
          :disabled="loading"
          class="px-4 py-2 rounded-md text-sm font-medium bg-[#FBEDED] dark:bg-[#3A1E1E] text-[#C97C7C] dark:text-[#ECA1A1] hover:bg-[#f7d9d9] dark:hover:bg-[#4E2A2A] transition-colors disabled:opacity-60"
        >
          {{ loading ? 'Eliminando...' : (confirmLabel || 'Eliminar') }}
        </button>
      </div>
    </div>
  </AppModal>
</template>
