<script setup lang="ts">
import { ref } from 'vue'
import { usePostresStore, type Postre } from '@/stores/postres'
import { useToast } from '@/composables/useToast'
import DessertGrid from '@/components/postres/DessertGrid.vue'
import DessertFormModal from '@/components/postres/DessertFormModal.vue'
import SaleModal from '@/components/postres/SaleModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const postresStore = usePostresStore()
const { show } = useToast()

const showFormModal = ref(false)
const showSaleModal = ref(false)
const showDeleteModal = ref(false)
const selectedPostre = ref<Postre | null>(null)
const deletingLoading = ref(false)

function openAdd() {
  selectedPostre.value = null
  showFormModal.value = true
}

function openEdit(postre: Postre) {
  selectedPostre.value = postre
  showFormModal.value = true
}

function openSell(postre: Postre) {
  selectedPostre.value = postre
  showSaleModal.value = true
}

function openDelete(postre: Postre) {
  selectedPostre.value = postre
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!selectedPostre.value) return
  deletingLoading.value = true
  try {
    await postresStore.deletePostre(selectedPostre.value.id)
    show('Postre eliminado correctamente')
    showDeleteModal.value = false
  } catch {
    show('Error al eliminar el postre', 'error')
  } finally {
    deletingLoading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-[#2C2C2A] dark:text-[#E2DFF0] tracking-tight">Gestión de Postres</h2>
        <p class="text-sm text-[#87858F] dark:text-[#9A95B0] mt-0.5">{{ postresStore.postres.length }} postres registrados</p>
      </div>
      <button
        @click="openAdd"
        class="flex items-center gap-2 px-4 py-2 rounded-md bg-lila-dark text-white text-sm font-medium hover:bg-lila-hover transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Agregar postre
      </button>
    </div>

    <DessertGrid
      :postres="postresStore.postres"
      @sell="openSell"
      @edit="openEdit"
      @delete="openDelete"
    />

    <DessertFormModal
      v-model="showFormModal"
      :postre="selectedPostre"
    />

    <SaleModal
      v-model="showSaleModal"
      :postre="selectedPostre"
    />

    <ConfirmModal
      v-model="showDeleteModal"
      title="Eliminar postre"
      :message="`¿Segura que quieres eliminar &quot;${selectedPostre?.nombre}&quot;? Esta acción no se puede deshacer.`"
      :loading="deletingLoading"
      @confirm="handleDelete"
    />
  </div>
</template>
