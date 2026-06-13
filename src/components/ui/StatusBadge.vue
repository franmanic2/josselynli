<script setup lang="ts">
defineProps<{
  estado: 'pendiente' | 'entregado'
}>()
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium transition-colors duration-200',
      estado === 'pendiente'
        ? 'bg-[#FBF3DE] text-[#B0852F] dark:bg-[#B0852F]/15 dark:text-[#F5D37F]'
        : 'bg-[#E6F2E9] text-[#4A8A5E] dark:bg-[#4A8A5E]/15 dark:text-[#77C18F]',
    ]"
  >
    {{ estado === 'pendiente' ? 'Pendiente' : 'Entregado' }}
  </span>
</template>
