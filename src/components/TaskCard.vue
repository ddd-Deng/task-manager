<script setup>
import { STATUSES, PRIORITIES } from '../domain/tasks.js'
defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['view', 'edit', 'delete'])
</script>

<template>
  <article class="task-card" :aria-label="task.title">
    <div class="card-top"><span class="priority-badge" :class="task.priority"><span aria-hidden="true">●</span>{{ PRIORITIES.find(item => item.value === task.priority).label }}</span><span class="status-label" :class="task.status">{{ STATUSES.find(item => item.value === task.status).label }}</span></div>
    <button class="task-title" @click="emit('view', task)">{{ task.title }}</button>
    <p class="task-description">{{ task.description || '暂无描述' }}</p>
    <div class="card-bottom"><button class="text-button" @click="emit('view', task)">查看详情 <span aria-hidden="true">↗</span></button><div class="flex gap-3"><button class="text-button" :aria-label="'编辑：' + task.title" @click="emit('edit', task)">编辑</button><button class="text-button danger-text" :aria-label="'删除：' + task.title" @click="emit('delete', task)">删除</button></div></div>
  </article>
</template>
