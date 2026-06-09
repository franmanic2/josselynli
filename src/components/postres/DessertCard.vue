<script setup lang="ts">
import type { Postre } from '@/stores/postres'

defineProps<{ postre: Postre }>()
const emit = defineEmits<{
  sell: [postre: Postre]
  edit: [postre: Postre]
  delete: [postre: Postre]
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-black/[0.09] shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
    <!-- Image -->
    <div class="h-44 bg-lila-tint overflow-hidden">
      <img
        v-if="postre.imagenUrl"
        :src="postre.imagenUrl"
        :alt="postre.nombre"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-12 h-12 text-lila-medium opacity-40" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="mb-3">
        <p class="text-xs text-[#87858F] font-medium mb-0.5">{{ postre.categoria }}</p>
        <h3 class="font-semibold text-[#2C2C2A] tracking-tight truncate">{{ postre.nombre }}</h3>
        <p class="text-lila-dark font-semibold mt-1">S/ {{ postre.precio.toFixed(2) }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="emit('sell', postre)"
          class="flex-1 py-1.5 rounded-md text-xs font-medium bg-lila-dark text-white hover:bg-lila-hover transition-colors"
        >
          Vender
        </button>
        <button
          @click="emit('edit', postre)"
          class="flex-1 py-1.5 rounded-md text-xs font-medium bg-lila-tint text-lila-dark hover:bg-lila-tint2 transition-colors"
        >
          Editar
        </button>
        <button
          @click="emit('delete', postre)"
          class="flex-1 py-1.5 rounded-md text-xs font-medium bg-[#FBEDED] text-[#C97C7C] hover:bg-[#f7d9d9] transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
