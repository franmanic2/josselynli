<script setup lang="ts">
defineProps<{
  estado: 'pendiente' | 'entregado'
}>()
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium',
      estado === 'pendiente'
        ? 'bg-[#FBF3DE] text-[#B0852F]'
        : 'bg-[#E6F2E9] text-[#4A8A5E]',
    ]"
  >
    {{ estado === 'pendiente' ? 'Pendiente' : 'Entregado' }}
  </span>
</template>
