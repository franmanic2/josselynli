<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import { usePostresStore, type Postre } from '@/stores/postres'
import { useToast } from '@/composables/useToast'
import { compressImage } from '@/utils/imageUtils'

const props = defineProps<{
  modelValue: boolean
  postre?: Postre | null
}>()
const emit = defineEmits<{ 'update:modelValue': [val: boolean] }>()

const postresStore = usePostresStore()
const { show } = useToast()

const loading = ref(false)
const nombre = ref('')
const categoria = ref('')
const precio = ref<number | ''>('')
const imagenBase64 = ref('')
const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const compressing = ref(false)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (props.postre) {
        nombre.value = props.postre.nombre
        categoria.value = props.postre.categoria
        precio.value = props.postre.precio
        imagenBase64.value = props.postre.imagenUrl
      } else {
        resetForm()
      }
    }
  },
)

function resetForm() {
  nombre.value = ''
  categoria.value = ''
  precio.value = ''
  imagenBase64.value = ''
  isDragOver.value = false
}

async function handleFileSelect(file: File) {
  if (!file.type.startsWith('image/')) {
    show('El archivo debe ser una imagen', 'error')
    return
  }
  compressing.value = true
  try {
    imagenBase64.value = await compressImage(file)
  } catch {
    show('No se pudo procesar la imagen', 'error')
  } finally {
    compressing.value = false
  }
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) handleFileSelect(input.files[0])
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFileSelect(file)
}

async function handleSubmit() {
  if (!nombre.value || !categoria.value || precio.value === '') {
    show('Completa todos los campos obligatorios', 'error')
    return
  }

  loading.value = true
  try {
    const data = {
      nombre: nombre.value,
      categoria: categoria.value,
      precio: Number(precio.value),
      imagenUrl: imagenBase64.value,
    }

    if (props.postre) {
      await postresStore.updatePostre(props.postre.id, data)
      show('Postre actualizado correctamente')
    } else {
      await postresStore.addPostre(data)
      show('Postre agregado correctamente')
    }
    emit('update:modelValue', false)
    resetForm()
  } catch {
    show('Error al guardar el postre', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="p-6">
      <h2 class="font-semibold text-[#2C2C2A] tracking-tight text-lg mb-5">
        {{ postre ? 'Editar postre' : 'Agregar postre' }}
      </h2>

      <!-- Image upload zone -->
      <div
        class="mb-5 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors"
        :class="isDragOver ? 'border-lila-medium bg-lila-tint' : 'border-black/[0.12] hover:border-lila-medium'"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
        @drop.prevent="onDrop"
        @click="fileInputRef?.click()"
      >
        <!-- Loading state -->
        <div v-if="compressing" class="h-40 flex flex-col items-center justify-center gap-2 text-[#87858F]">
          <svg class="w-6 h-6 animate-spin text-lila-medium" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p class="text-sm">Procesando imagen...</p>
        </div>

        <!-- Preview -->
        <div v-else-if="imagenBase64" class="h-40 relative">
          <img :src="imagenBase64" class="w-full h-full object-cover" alt="Preview" />
          <div class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="text-white text-sm font-medium">Cambiar imagen</span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="h-40 flex flex-col items-center justify-center gap-2 text-[#87858F]">
          <svg class="w-8 h-8 opacity-40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm font-medium">Arrastra o haz clic para subir</p>
          <p class="text-xs opacity-60">JPG, PNG, WEBP</p>
        </div>

        <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileInput" />
      </div>

      <!-- Fields -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">
            Nombre <span class="text-[#C97C7C]">*</span>
          </label>
          <input
            v-model="nombre"
            type="text"
            placeholder="Ej. Tarta de Frutos Rojos"
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">
            Categoría <span class="text-[#C97C7C]">*</span>
          </label>
          <input
            v-model="categoria"
            type="text"
            placeholder="Ej. Tartas, Cheesecakes..."
            class="w-full px-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#2C2C2A] mb-1.5">
            Precio <span class="text-[#C97C7C]">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#87858F]">S/</span>
            <input
              v-model="precio"
              type="number"
              min="0"
              step="0.50"
              placeholder="0.00"
              class="w-full pl-9 pr-3 py-2.5 rounded-lg border border-black/[0.09] text-sm text-[#2C2C2A] placeholder-[#87858F] focus:outline-none focus:ring-2 focus:ring-lila-medium/30 focus:border-lila-medium transition-colors"
            />
          </div>
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
          :disabled="loading || compressing"
          class="px-4 py-2 rounded-md text-sm font-medium bg-lila-dark text-white hover:bg-lila-hover transition-colors disabled:opacity-60"
        >
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </AppModal>
</template>
