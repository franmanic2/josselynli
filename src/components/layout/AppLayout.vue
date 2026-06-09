<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { usePostresStore } from '@/stores/postres'
import { useVentasStore } from '@/stores/ventas'

const sidebarOpen = ref(false)
const postresStore = usePostresStore()
const ventasStore = useVentasStore()

onMounted(() => {
  postresStore.startListening()
  ventasStore.startListening()
})

onUnmounted(() => {
  postresStore.stopListening()
  ventasStore.stopListening()
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#FAF9FC]">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col md:ml-[220px] min-w-0">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
