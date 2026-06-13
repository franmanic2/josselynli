<script setup lang="ts">
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useVentasStore, type Venta } from '@/stores/ventas'
import { useToast } from '@/composables/useToast'
import { ref } from 'vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

defineProps<{ ventas: Venta[] }>()

const ventasStore = useVentasStore()
const { show } = useToast()
const markingId = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const ventaToDelete = ref<string | null>(null)
const deletingId = ref<string | null>(null)

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

function confirmDelete(id: string) {
  ventaToDelete.value = id
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!ventaToDelete.value) return
  deletingId.value = ventaToDelete.value
  showDeleteConfirm.value = false
  try {
    await ventasStore.deleteVenta(ventaToDelete.value)
    show('Venta eliminada correctamente')
  } catch {
    show('Error al eliminar la venta', 'error')
  } finally {
    deletingId.value = null
    ventaToDelete.value = null
  }
}
</script>

<template>
  <div class="bg-white dark:bg-[#171520] rounded-xl border border-black/[0.09] dark:border-white/[0.05] shadow-sm overflow-hidden transition-colors duration-200">
    <!-- Desktop & Tablet Version -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-black/[0.06] dark:border-white/[0.05]">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Postre</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Cliente</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Precio</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Registrado</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Entrega</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Estado</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-[#87858F] dark:text-[#9A95B0] uppercase tracking-wide">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="ventas.length === 0">
            <td colspan="7" class="text-center py-10 text-[#87858F] dark:text-[#9A95B0] text-sm">
              No se encontraron pedidos
            </td>
          </tr>
          <tr
            v-for="venta in ventas"
            :key="venta.id"
            class="border-b border-black/[0.04] dark:border-white/[0.05] hover:bg-[#FAF9FC] dark:hover:bg-white/[0.02] transition-colors last:border-0"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <img
                  v-if="venta.imagenUrl"
                  :src="venta.imagenUrl"
                  :alt="venta.nombrePostre"
                  class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
                <div class="flex flex-col">
                  <span class="font-medium text-[#2C2C2A] dark:text-[#E2DFF0]">{{ venta.nombrePostre }}</span>
                  <span class="text-xs text-[#87858F] dark:text-[#9A95B0]">
                    {{ venta.cantidad || 1 }} {{ (venta.cantidad || 1) === 1 ? 'unidad' : 'unidades' }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[#2C2C2A] dark:text-[#E2DFF0]">{{ venta.nombreCliente }}</td>
            <td class="px-5 py-3.5 font-semibold text-lila-dark dark:text-[#C8B4E3]">S/ {{ venta.precioVenta.toFixed(2) }}</td>
            <td class="px-5 py-3.5 text-[#87858F] dark:text-[#9A95B0]">{{ formatDate(venta.fechaRegistro) }}</td>
            <td class="px-5 py-3.5 text-[#87858F] dark:text-[#9A95B0]">{{ formatDate(venta.fechaEntrega) }}</td>
            <td class="px-5 py-3.5">
              <StatusBadge :estado="venta.estado" />
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button
                  v-if="venta.estado === 'pendiente'"
                  @click="markDelivered(venta.id)"
                  :disabled="markingId === venta.id || deletingId === venta.id"
                  class="text-xs font-medium px-3 py-1.5 rounded-md bg-[#E6F2E9] dark:bg-[#1C3A27] text-[#4A8A5E] dark:text-[#77C18F] hover:bg-[#d2ecd9] dark:hover:bg-[#254F34] transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {{ markingId === venta.id ? 'Guardando...' : 'Marcar entregado' }}
                </button>
                <button
                  @click="confirmDelete(venta.id)"
                  :disabled="markingId === venta.id || deletingId === venta.id"
                  class="p-1.5 rounded-md text-[#C97C7C] dark:text-[#ECA1A1] hover:bg-[#FBEDED] dark:hover:bg-[#3A1E1E] transition-colors"
                  title="Eliminar venta"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Version (Cards List) -->
    <div class="block md:hidden divide-y divide-black/[0.08] dark:divide-white/[0.05]">
      <div v-if="ventas.length === 0" class="text-center py-8 text-[#87858F] dark:text-[#9A95B0] text-sm">
        No se encontraron pedidos
      </div>
      <div
        v-for="venta in ventas"
        :key="venta.id"
        class="p-4 space-y-3.5 transition-colors duration-200"
      >
        <!-- Card Header: Image, Title, Quantity, Delete button -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img
              v-if="venta.imagenUrl"
              :src="venta.imagenUrl"
              :alt="venta.nombrePostre"
              class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div>
              <h4 class="font-semibold text-sm text-[#2C2C2A] dark:text-[#E2DFF0] leading-snug">{{ venta.nombrePostre }}</h4>
              <span class="text-xs text-[#87858F] dark:text-[#9A95B0] mt-0.5 inline-block">
                {{ venta.cantidad || 1 }} {{ (venta.cantidad || 1) === 1 ? 'unidad' : 'unidades' }}
              </span>
            </div>
          </div>
          <button
            @click="confirmDelete(venta.id)"
            :disabled="markingId === venta.id || deletingId === venta.id"
            class="p-2 rounded-lg text-[#C97C7C] dark:text-[#ECA1A1] hover:bg-[#FBEDED] dark:hover:bg-[#3A1E1E] transition-colors"
            title="Eliminar venta"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
          <div>
            <span class="block text-[#87858F] dark:text-[#9A95B0] font-medium mb-0.5">Cliente</span>
            <span class="text-[#2C2C2A] dark:text-[#E2DFF0] font-medium">{{ venta.nombreCliente }}</span>
          </div>
          <div class="text-right">
            <span class="block text-[#87858F] dark:text-[#9A95B0] font-medium mb-0.5">Precio Total</span>
            <span class="font-semibold text-lila-dark dark:text-[#C8B4E3]">S/ {{ venta.precioVenta.toFixed(2) }}</span>
          </div>
          <div>
            <span class="block text-[#87858F] dark:text-[#9A95B0] font-medium mb-0.5">Registrado</span>
            <span class="text-[#87858F] dark:text-[#9A95B0]">{{ formatDate(venta.fechaRegistro) }}</span>
          </div>
          <div class="text-right">
            <span class="block text-[#87858F] dark:text-[#9A95B0] font-medium mb-0.5">Entrega</span>
            <span class="text-[#87858F] dark:text-[#9A95B0]">{{ formatDate(venta.fechaEntrega) }}</span>
          </div>
        </div>

        <!-- Card Footer: Status and Action button -->
        <div class="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
          <StatusBadge :estado="venta.estado" />
          <button
            v-if="venta.estado === 'pendiente'"
            @click="markDelivered(venta.id)"
            :disabled="markingId === venta.id || deletingId === venta.id"
            class="text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#E6F2E9] dark:bg-[#1C3A27] text-[#4A8A5E] dark:text-[#77C18F] hover:bg-[#d2ecd9] dark:hover:bg-[#254F34] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {{ markingId === venta.id ? 'Guardando...' : 'Marcar entregado' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-model="showDeleteConfirm"
    title="¿Eliminar registro de venta?"
    message="Esta acción no se puede deshacer. Se eliminará el registro de venta permanentemente."
    confirm-label="Eliminar"
    :loading="!!deletingId"
    @confirm="handleDelete"
  />
</template>
