<script setup lang="ts">
defineProps<{
  selectedMonth: string
  selectedEstado: string
  count: number
}>()
const emit = defineEmits<{
  'update:selectedMonth': [val: string]
  'update:selectedEstado': [val: string]
}>()

const months = [
  { value: '0', label: 'Enero' },
  { value: '1', label: 'Febrero' },
  { value: '2', label: 'Marzo' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Mayo' },
  { value: '5', label: 'Junio' },
  { value: '6', label: 'Julio' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Septiembre' },
  { value: '9', label: 'Octubre' },
  { value: '10', label: 'Noviembre' },
  { value: '11', label: 'Diciembre' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 mb-5">
    <select
      :value="selectedMonth"
      @change="emit('update:selectedMonth', ($event.target as HTMLSelectElement).value)"
      class="px-3 py-2 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium bg-white transition-colors"
    >
      <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
    </select>

    <select
      :value="selectedEstado"
      @change="emit('update:selectedEstado', ($event.target as HTMLSelectElement).value)"
      class="px-3 py-2 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium bg-white transition-colors"
    >
      <option value="">Todos</option>
      <option value="pendiente">Pendiente</option>
      <option value="entregado">Entregado</option>
    </select>

    <span class="text-sm text-[#87858F] ml-auto">
      <span class="font-semibold text-[#2C2C2A]">{{ count }}</span> pedidos encontrados
    </span>
  </div>
</template>
