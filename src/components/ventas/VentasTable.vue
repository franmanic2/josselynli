<script setup lang="ts">
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useVentasStore, type Venta } from '@/stores/ventas'
import { useToast } from '@/composables/useToast'
import { ref } from 'vue'

defineProps<{ ventas: Venta[] }>()

const ventasStore = useVentasStore()
const { show } = useToast()
const markingId = ref<string | null>(null)

function formatDate(ts: import('firebase/firestore').Timestamp) {
  const d = ts.toDate()
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function markDelivered(id: string) {
  markingId.value = id
  try {
    await ventasStore.markAsDelivered(id)
    show('Pedido marcado como entregado')
  } catch {
    show('Error al actualizar el pedido', 'error')
  } finally {
    markingId.value = null
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-black/[0.09] shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-black/[0.06]">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Postre</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Cliente</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Precio</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Registrado</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Entrega</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Estado</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] uppercase tracking-wide">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="ventas.length === 0"
          >
            <td colspan="7" class="text-center py-10 text-[#87858F] text-sm">
              No se encontraron pedidos
            </td>
          </tr>
          <tr
            v-for="venta in ventas"
            :key="venta.id"
            class="border-b border-black/[0.04] hover:bg-[#FAF9FC] transition-colors last:border-0"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <img
                  v-if="venta.imagenUrl"
                  :src="venta.imagenUrl"
                  :alt="venta.nombrePostre"
                  class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
                <span class="font-medium text-[#2C2C2A]">{{ venta.nombrePostre }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[#2C2C2A]">{{ venta.nombreCliente }}</td>
            <td class="px-5 py-3.5 font-semibold text-lila-dark">S/ {{ venta.precioVenta.toFixed(2) }}</td>
            <td class="px-5 py-3.5 text-[#87858F]">{{ formatDate(venta.fechaRegistro) }}</td>
            <td class="px-5 py-3.5 text-[#87858F]">{{ formatDate(venta.fechaEntrega) }}</td>
            <td class="px-5 py-3.5">
              <StatusBadge :estado="venta.estado" />
            </td>
            <td class="px-5 py-3.5">
              <button
                v-if="venta.estado === 'pendiente'"
                @click="markDelivered(venta.id)"
                :disabled="markingId === venta.id"
                class="text-xs font-medium px-3 py-1.5 rounded-md bg-[#E6F2E9] text-[#4A8A5E] hover:bg-[#d2ecd9] transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {{ markingId === venta.id ? 'Guardando...' : 'Marcar entregado' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
