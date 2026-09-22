<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
defineProps({ title: { type: String, required: true } })
const emit = defineEmits(['close'])
const dialog = ref(null)
let previousFocus
onMounted(() => {
  previousFocus = document.activeElement
  dialog.value.showModal()
})
onBeforeUnmount(() => {
  dialog.value?.close()
  if (previousFocus?.isConnected) previousFocus.focus()
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="modal" aria-labelledby="modal-title" @cancel.prevent="emit('close')">
      <div class="modal-heading"><h2 id="modal-title">{{ title }}</h2><button type="button" class="icon-button" aria-label="关闭弹窗" @click="emit('close')">×</button></div>
      <slot />
    </dialog>
  </Teleport>
</template>
