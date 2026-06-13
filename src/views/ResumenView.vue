<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useThemeStore } from '@/stores/theme'
import MetricCard from '@/components/ui/MetricCard.vue'
import VentasTable from '@/components/ventas/VentasTable.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ventasStore = useVentasStore()
const themeStore = useThemeStore()

const now = new Date()
const selectedYear = ref(now.getFullYear())
const selectedMonth = ref(now.getMonth())

const months = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - i)

const ventasMes = computed(() =>
  ventasStore.ventas.filter((v) => {
    const d = v.fechaRegistro.toDate()
    return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value
  }),
)

const totalRecaudado = computed(() =>
  ventasMes.value.reduce((sum, v) => sum + v.precioVenta, 0),
)

const cantidadVentas = computed(() => ventasMes.value.length)

const postreMasVendido = computed(() => {
  const counts: Record<string, number> = {}
  for (const v of ventasMes.value) {
    counts[v.nombrePostre] = (counts[v.nombrePostre] || 0) + (v.cantidad || 1)
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] ?? '—'
})

function getWeekIndex(date: Date): number {
  return Math.min(Math.floor((date.getDate() - 1) / 7), 4)
}

const weeklyData = computed(() => {
  const weeks = [0, 0, 0, 0, 0]
  for (const v of ventasMes.value) {
    const idx = getWeekIndex(v.fechaRegistro.toDate())
    weeks[idx] = (weeks[idx] ?? 0) + v.precioVenta
  }
  return weeks
})

const chartData = computed(() => ({
  labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
  datasets: [
    {
      label: 'Ingresos (S/)',
      data: weeklyData.value,
      backgroundColor: '#9B7EC8',
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { parsed: { y: number } }) => `S/ ${ctx.parsed.y.toFixed(2)}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number | string) => `S/ ${value}`,
        font: { size: 11 },
        color: themeStore.isDark ? '#9A95B0' : '#87858F',
      },
      grid: { color: themeStore.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(44,44,42,0.06)' },
    },
    x: {
      ticks: { font: { size: 11 }, color: themeStore.isDark ? '#9A95B0' : '#87858F' },
      grid: { display: false },
    },
  },
}))

const ventasSorted = computed(() =>
  [...ventasMes.value].sort((a, b) => a.fechaEntrega.toMillis() - b.fechaEntrega.toMillis()),
)
</script>

<template>
  <div>
    <!-- Header + filters -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">Resumen Mensual</h2>
        <p class="text-sm text-[#87858F] dark:text-[#9A95B0] mt-0.5">Métricas y gráficos del período</p>
      </div>
      <div class="flex gap-3">
        <select
          v-model="selectedMonth"
          class="px-3 py-2 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium bg-white dark:bg-[#13111A] transition-colors"
        >
          <option v-for="(m, i) in months" :key="i" :value="i" class="dark:bg-[#13111A]">{{ m }}</option>
        </select>
        <select
          v-model="selectedYear"
          class="px-3 py-2 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium bg-white dark:bg-[#13111A] transition-colors"
        >
          <option v-for="y in years" :key="y" :value="y" class="dark:bg-[#13111A]">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- Metric cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title="Total recaudado"
        :value="`S/ ${totalRecaudado.toFixed(2)}`"
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <MetricCard
        title="Cantidad de ventas"
        :value="cantidadVentas"
        icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
      <MetricCard
        title="Postre más vendido"
        :value="postreMasVendido"
        icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </div>

    <!-- Bar chart -->
    <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm p-5 mb-6 transition-colors duration-200">
      <h3 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight mb-4">Ingresos por semana</h3>
      <div class="h-56">
        <Bar :data="chartData" :options="chartOptions as any" />
      </div>
    </div>

    <!-- Ventas table -->
    <div class="mb-3">
      <h3 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">
        Ventas de {{ months[selectedMonth] }} {{ selectedYear }}
      </h3>
    </div>
    <VentasTable :ventas="ventasSorted" />
  </div>
</template>
