<script setup>
import TaskCard from './TaskCard.vue'
import { STATUSES } from '../domain/tasks.js'
defineProps({ tasks: { type: Array, required: true } })
const emit = defineEmits(['view', 'edit', 'delete', 'move'])
function byStatus(tasks, status) { return tasks.filter(task => task.status === status) }
</script>

<template>
  <div class="board" @dragover.prevent>
    <section v-for="status in STATUSES" :key="status.value" class="board-column" @drop="emit('move', $event, status.value)">
      <div class="board-heading"><div><h2><span class="status-dot" :class="status.value"></span>{{ status.label }}</h2><p>{{ status.hint }}</p></div><span class="count">{{ byStatus(tasks, status.value).length }}</span></div>
      <div class="board-cards"><div v-if="!byStatus(tasks, status.value).length" class="board-empty">拖动任务到这里</div><div v-for="task in byStatus(tasks, status.value)" :key="task.id" draggable="true" @dragstart="emit('move', $event, task.id)"><TaskCard :task="task" @view="emit('view', $event)" @edit="emit('edit', $event)" @delete="emit('delete', $event)" /></div></div>
    </section>
  </div>
</template>
