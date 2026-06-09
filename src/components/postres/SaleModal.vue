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

  loading.value = true
  try {
    await ventasStore.addVenta({
      postreId: selectedPostre.value.id,
      nombrePostre: selectedPostre.value.nombre,
      imagenUrl: selectedPostre.value.imagenUrl,
      precioVenta: selectedPostre.value.precio,
      nombreCliente: nombreCliente.value.trim(),
      fechaEntrega: new Date(fechaEntrega.value + 'T12:00:00'),
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
      <h2 class="font-semibold text-[#2C2C2A] tracking-tight text-lg mb-5">Registrar venta</h2>

      <div class="space-y-4">
        <!-- Postre selector (when opened from dashboard) -->
        <div v-if="!postre">
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">Postre</label>
          <select
            v-model="selectedPostreId"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors bg-white"
          >
            <option value="" disabled>Selecciona un postre</option>
            <option v-for="p in postresStore.postres" :key="p.id" :value="p.id">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <!-- Read-only postre info -->
        <div v-if="selectedPostre" class="flex items-center gap-3 p-3 bg-lila-tint rounded-lg">
          <img
            v-if="selectedPostre.imagenUrl"
            :src="selectedPostre.imagenUrl"
            :alt="selectedPostre.nombre"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p class="text-sm font-medium text-[#2C2C2A]">{{ selectedPostre.nombre }}</p>
            <p class="text-sm text-lila-dark font-semibold">S/ {{ selectedPostre.precio.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Cliente -->
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">Nombre del cliente</label>
          <input
            v-model="nombreCliente"
            type="text"
            placeholder="Ej. María García"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
          />
        </div>

        <!-- Fecha de entrega -->
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">Fecha de entrega</label>
          <input
            v-model="fechaEntrega"
            type="date"
            :min="today"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="emit('update:modelValue', false)"
          class="px-4 py-2 rounded-md text-sm font-medium text-[#87858F] hover:bg-gray-50 border border-black/[0.09] transition-colors"
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
