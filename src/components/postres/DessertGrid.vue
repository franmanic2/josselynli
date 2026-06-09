<script setup lang="ts">
import DessertCard from './DessertCard.vue'
import type { Postre } from '@/stores/postres'

defineProps<{ postres: Postre[] }>()
const emit = defineEmits<{
  sell: [postre: Postre]
  edit: [postre: Postre]
  delete: [postre: Postre]
}>()
</script>

<template>
  <div v-if="postres.length === 0" class="text-center py-16 text-[#87858F]">
    <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2.25c4.97 0 9 2.015 9 4.5V12c0 2.485-4.03 4.5-9 4.5S3 14.485 3 12V6.75c0-2.485 4.03-4.5 9-4.5z" />
    </svg>
    <p class="text-sm">No hay postres registrados. ¡Agrega el primero!</p>
  </div>
  <TransitionGroup
    v-else
    name="list"
    tag="div"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    <DessertCard
      v-for="postre in postres"
      :key="postre.id"
      :postre="postre"
      @sell="emit('sell', $event)"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </TransitionGroup>
</template>
