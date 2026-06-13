<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePostresStore } from '@/stores/postres'
import { useVentasStore } from '@/stores/ventas'
import MetricCard from '@/components/ui/MetricCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import SaleModal from '@/components/postres/SaleModal.vue'
import type { Timestamp } from 'firebase/firestore'

const postresStore = usePostresStore()
const ventasStore = useVentasStore()

const showSaleModal = ref(false)

const today = new Date()
const todayStr = today.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

function isSameDay(ts: Timestamp) {
  const d = ts.toDate()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

function formatDelivery(ts: Timestamp) {
  if (isSameDay(ts)) return 'Hoy'
  return ts.toDate().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Metrics
const ventasMes = computed(() => {
  const now = new Date()
  return ventasStore.ventas
    .filter((v) => {
      const d = v.fechaRegistro.toDate()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, v) => sum + v.precioVenta, 0)
})

const pedidosPendientes = computed(() =>
  ventasStore.ventas.filter((v) => v.estado === 'pendiente'),
)

const entregadosHoy = computed(() =>
  ventasStore.ventas.filter(
    (v) => v.estado === 'entregado' && isSameDay(v.fechaEntrega),
  ).length,
)

// Postres más vendidos
const postresMasVendidos = computed(() => {
  const counts: Record<string, { nombre: string; imagenUrl: string; count: number }> = {}
  for (const v of ventasStore.ventas) {
    if (!counts[v.postreId]) {
      counts[v.postreId] = { nombre: v.nombrePostre, imagenUrl: v.imagenUrl, count: 0 }
    }
    const postre = counts[v.postreId]
    if (postre) {
      postre.count += v.cantidad || 1
    }
  }
  return Object.entries(counts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const maxVentas = computed(() => Math.max(...postresMasVendidos.value.map((p) => p.count), 1))

// Movimientos recientes
const movimientosRecientes = computed(() =>
  [...ventasStore.ventas]
    .sort((a, b) => b.fechaRegistro.toMillis() - a.fechaRegistro.toMillis())
    .slice(0, 5),
)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-7">
      <div>
        <h2 class="text-2xl font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">Hola, Joselyn 👋</h2>
        <p class="text-sm text-[#87858F] dark:text-[#9A95B0] mt-0.5 capitalize">{{ todayStr }}</p>
      </div>
      <button
        @click="showSaleModal = true"
        class="flex items-center gap-2 px-4 py-2 rounded-md bg-lila-dark text-white text-sm font-medium hover:bg-lila-hover transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Registrar venta
      </button>
    </div>

    <!-- Metric cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      <MetricCard
        title="Ventas del mes"
        :value="`S/ ${ventasMes.toFixed(2)}`"
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <MetricCard
        title="Postres registrados"
        :value="postresStore.postres.length"
        icon="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2.25c4.97 0 9 2.015 9 4.5V12c0 2.485-4.03 4.5-9 4.5S3 14.485 3 12V6.75c0-2.485 4.03-4.5 9-4.5z"
      />
      <MetricCard
        title="Pedidos pendientes"
        :value="pedidosPendientes.length"
        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        color="#FBF3DE"
      />
      <MetricCard
        title="Entregados hoy"
        :value="entregadosHoy"
        icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        color="#E6F2E9"
      />
    </div>

    <div class="grid lg:grid-cols-3 gap-5">
      <!-- Postres más vendidos -->
      <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm p-5 transition-colors duration-200">
        <h3 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight mb-4">Postres más vendidos</h3>
        <div v-if="postresMasVendidos.length === 0" class="text-center py-6 text-sm text-[#87858F] dark:text-[#9A95B0]">
          Sin ventas registradas
        </div>
        <ul v-else class="space-y-3">
          <li v-for="postre in postresMasVendidos" :key="postre.id" class="flex items-center gap-3">
            <img
              v-if="postre.imagenUrl"
              :src="postre.imagenUrl"
              :alt="postre.nombre"
              class="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] truncate">{{ postre.nombre }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex-1 bg-lila-tint rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-full bg-lila-medium rounded-full transition-all"
                    :style="{ width: `${(postre.count / maxVentas) * 100}%` }"
                  />
                </div>
                <span class="text-xs text-[#87858F] dark:text-[#9A95B0] flex-shrink-0">{{ postre.count }}x</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Pedidos pendientes -->
      <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm p-5 transition-colors duration-200">
        <h3 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight mb-4">Pedidos pendientes</h3>
        <div v-if="pedidosPendientes.length === 0" class="text-center py-6 text-sm text-[#87858F] dark:text-[#9A95B0]">
          No hay pedidos pendientes
        </div>
        <ul v-else class="space-y-3">
          <li
            v-for="venta in pedidosPendientes.slice(0, 5)"
            :key="venta.id"
            class="border-l-[3px] border-lila-medium pl-3 py-0.5"
          >
            <p class="text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] truncate">{{ venta.nombrePostre }}</p>
            <p class="text-xs text-[#87858F] dark:text-[#9A95B0]">{{ venta.nombreCliente }}</p>
            <p class="text-xs font-medium mt-0.5" :class="isSameDay(venta.fechaEntrega) ? 'text-lila-dark dark:text-[#C8B4E3]' : 'text-[#87858F] dark:text-[#9A95B0]'">
              {{ formatDelivery(venta.fechaEntrega) }}
            </p>
          </li>
        </ul>
      </div>

      <!-- Movimientos recientes -->
      <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm p-5 transition-colors duration-200">
        <h3 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight mb-4">Movimientos recientes</h3>
        <div v-if="movimientosRecientes.length === 0" class="text-center py-6 text-sm text-[#87858F] dark:text-[#9A95B0]">
          Sin movimientos
        </div>
        <table v-else class="w-full text-xs">
          <thead>
            <tr class="text-[#87858F] dark:text-[#9A95B0] border-b border-black/[0.06] dark:border-white/[0.05]">
              <th class="text-left pb-2 font-medium">Postre</th>
              <th class="text-left pb-2 font-medium">Cliente</th>
              <th class="text-left pb-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="v in movimientosRecientes"
              :key="v.id"
              class="border-b border-black/[0.04] dark:border-white/[0.05] last:border-0"
            >
              <td class="py-2 pr-2 font-medium text-[#2C2C2A] dark:text-[#E2DFF0] truncate max-w-[80px]">{{ v.nombrePostre }}</td>
              <td class="py-2 pr-2 text-[#87858F] dark:text-[#9A95B0] truncate max-w-[70px]">{{ v.nombreCliente }}</td>
              <td class="py-2">
                <StatusBadge :estado="v.estado" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sale modal (no postre pre-selected) -->
    <SaleModal v-model="showSaleModal" />
  </div>
</template>
