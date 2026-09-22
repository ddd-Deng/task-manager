<script setup>
import TaskCard from './TaskCard.vue'
defineProps({ tasks: { type: Array, required: true } })
const emit = defineEmits(['view', 'edit', 'delete'])
</script>

<template>
  <div class="task-list"><TaskCard v-for="task in tasks" :key="task.id" :task="task" @view="emit('view', $event)" @edit="emit('edit', $event)" @delete="emit('delete', $event)" /></div>
</template>
