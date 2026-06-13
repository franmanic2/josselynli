<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useVentasStore } from '@/stores/ventas'
import { usePostresStore, type Postre } from '@/stores/postres'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  modelValue: boolean
  postre?: Postre | null
}>()
const emit = defineEmits<{ 'update:modelValue': [val: boolean] }>()

const ventasStore = useVentasStore()
const postresStore = usePostresStore()
const { show } = useToast()

const loading = ref(false)
const nombreCliente = ref('')
const fechaEntrega = ref('')
const selectedPostreId = ref('')
const cantidad = ref(1)

const today = new Date().toISOString().split('T')[0]

const selectedPostre = computed<Postre | undefined>(() => {
  if (props.postre) return props.postre
  return postresStore.postres.find((p) => p.id === selectedPostreId.value)
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      nombreCliente.value = ''
      fechaEntrega.value = ''
      selectedPostreId.value = ''
      cantidad.value = 1
    }
  },
)

async function handleSubmit() {
  if (!selectedPostre.value) {
    show('Selecciona un postre', 'error')
    return
  }
  if (!nombreCliente.value.trim()) {
    show('Ingresa el nombre del cliente', 'error')
    return
  }
  if (!fechaEntrega.value) {
    show('Selecciona la fecha de entrega', 'error')
    return
  }
  if (!cantidad.value || cantidad.value < 1) {
    show('Ingresa una cantidad válida', 'error')
    return
  }

  loading.value = true
  try {
    await ventasStore.addVenta({
      postreId: selectedPostre.value.id,
      nombrePostre: selectedPostre.value.nombre,
      imagenUrl: selectedPostre.value.imagenUrl,
      precioVenta: selectedPostre.value.precio * cantidad.value,
      nombreCliente: nombreCliente.value.trim(),
      fechaEntrega: new Date(fechaEntrega.value + 'T12:00:00'),
      cantidad: cantidad.value,
    })
    show('Venta registrada correctamente')
    emit('update:modelValue', false)
  } catch {
    show('Error al registrar la venta', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="p-6">
      <h2 class="font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight text-lg mb-5">Registrar venta</h2>

      <div class="space-y-4">
        <!-- Postre selector (when opened from dashboard) -->
        <div v-if="!postre">
          <label class="block text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] mb-1.5">Postre</label>
          <select
            v-model="selectedPostreId"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors bg-white dark:bg-[#13111A]"
          >
            <option value="" disabled class="dark:bg-[#13111A]">Selecciona un postre</option>
            <option v-for="p in postresStore.postres" :key="p.id" :value="p.id" class="dark:bg-[#13111A]">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <!-- Read-only postre info -->
        <div v-if="selectedPostre" class="flex items-center gap-3 p-3 bg-lila-tint dark:bg-lila-dark/10 rounded-lg">
          <img
            v-if="selectedPostre.imagenUrl"
            :src="selectedPostre.imagenUrl"
            :alt="selectedPostre.nombre"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p class="text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0]">{{ selectedPostre.nombre }}</p>
            <p class="text-sm text-lila-dark dark:text-[#C8B4E3] font-semibold">
              S/ {{ selectedPostre.precio.toFixed(2) }} <span class="text-xs text-[#87858F] dark:text-[#9A95B0] font-normal">c/u</span>
            </p>
          </div>
        </div>

        <!-- Cantidad y Total -->
        <div v-if="selectedPostre" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] mb-1.5">Cantidad</label>
            <input
              v-model.number="cantidad"
              type="number"
              min="1"
              class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors bg-white dark:bg-[#13111A]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] mb-1.5">Total</label>
            <div class="px-3 py-2.5 rounded-lg border border-black/[0.09] dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02] text-sm font-semibold text-lila-dark dark:text-[#C8B4E3]">
              S/ {{ (selectedPostre.precio * (cantidad || 0)).toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Cliente -->
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] mb-1.5">Nombre del cliente</label>
          <input
            v-model="nombreCliente"
            type="text"
            placeholder="Ej. María García"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors bg-white dark:bg-[#13111A]"
          />
        </div>

        <!-- Fecha de entrega -->
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] dark:text-[#E2DFF0] mb-1.5">Fecha de entrega</label>
          <input
            v-model="fechaEntrega"
            type="date"
            :min="today"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] dark:border-white/[0.05] text-sm text-[#2C2C2A] dark:text-[#E2DFF0] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors bg-white dark:bg-[#13111A]"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="emit('update:modelValue', false)"
          class="px-4 py-2 rounded-md text-sm font-medium text-[#87858F] dark:text-[#9A95B0] hover:bg-gray-50 dark:hover:bg-white/[0.04] border border-black/[0.09] dark:border-white/[0.05] transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-4 py-2 rounded-md text-sm font-medium bg-lila-dark text-white hover:bg-lila-hover transition-colors disabled:opacity-60"
        >
          {{ loading ? 'Registrando...' : 'Confirmar venta' }}
        </button>
      </div>
    </div>
  </AppModal>
</template>
