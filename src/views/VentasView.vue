<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import VentasTable from '@/components/ventas/VentasTable.vue'
import VentasFilters from '@/components/ventas/VentasFilters.vue'

const ventasStore = useVentasStore()

const now = new Date()
const selectedMonth = ref(String(now.getMonth()))
const selectedEstado = ref('')

const filteredVentas = computed(() => {
  return ventasStore.ventas
    .filter((v) => {
      const d = v.fechaEntrega.toDate()
      const monthMatch = d.getMonth() === Number(selectedMonth.value)
      const estadoMatch = !selectedEstado.value || v.estado === selectedEstado.value
      return monthMatch && estadoMatch
    })
    .sort((a, b) => a.fechaEntrega.toMillis() - b.fechaEntrega.toMillis())
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">Registro de Ventas</h2>
      <p class="text-sm text-[#87858F] dark:text-[#9A95B0] mt-0.5">Historial completo de pedidos</p>
    </div>

    <VentasFilters
      v-model:selected-month="selectedMonth"
      v-model:selected-estado="selectedEstado"
      :count="filteredVentas.length"
    />

    <VentasTable :ventas="filteredVentas" />
  </div>
</template>
