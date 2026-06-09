<script setup lang="ts">
defineProps<{
  modelValue: boolean
  maxWidth?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [val: boolean] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/30 z-40"
        @click="emit('update:modelValue', false)"
      />
    </Transition>
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('update:modelValue', false)"
      >
        <div
          class="bg-white rounded-xl shadow-lg w-full relative"
          :style="{ maxWidth: maxWidth || '480px' }"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
