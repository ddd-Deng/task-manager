<script setup>
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import TaskForm from './components/TaskForm.vue'
import AppModal from './components/AppModal.vue'
import { useTasks } from './composables/useTasks.js'
import { STATUSES, PRIORITIES } from './domain/tasks.js'

const { tasks, saveTask, removeTask } = useTasks()
const formOpen = ref(false)
const editing = ref(null)
const viewing = ref(null)
const deleting = ref(null)
const notice = ref('')
function openForm(task = null) { editing.value = task; viewing.value = null; formOpen.value = true }
function save(fields, id) { saveTask(fields, id); formOpen.value = false; notice.value = id ? '任务已更新' : '任务已创建' }
function confirmDelete() { removeTask(deleting.value.id); deleting.value = null; notice.value = '任务已删除' }
</script>

<template>
  <div class="app-shell">
    <header class="topbar"><a class="brand" href="./"><span class="brand-mark">✓</span>有序<span class="brand-sub">TASK MANAGER</span></a><span class="local-label">个人工作空间</span></header>
    <main class="workspace">
      <p class="eyebrow">MY WORKSPACE</p>
      <div class="page-heading"><div><h1>我的任务</h1><p class="subtitle">把想法变成行动，让每一步都有条不紊。</p></div><button class="button primary" @click="openForm()"><span class="plus" aria-hidden="true">+</span> 新建任务</button></div>
      <div class="toolbar"><span class="section-label">任务列表 <span class="count">{{ tasks.length }}</span></span><span class="local-label">按创建顺序排列</span></div>
      <p class="sr-only" role="status">{{ notice }}</p>
      <div v-if="!tasks.length" class="empty-state"><span class="empty-icon">✓</span><h2>从第一个任务开始</h2><p>将待办事项整理在这里，专注当下的每一步。</p><button class="button secondary" @click="openForm()">创建第一个任务</button></div>
      <TaskList v-else :tasks="tasks" @view="viewing = $event" @edit="openForm" @delete="deleting = $event" />
    </main>
    <footer>有序 · 留一点空间，给重要的事</footer>
  </div>
  <TaskForm v-if="formOpen" :task="editing" @save="save" @close="formOpen = false" />
  <AppModal v-if="viewing" title="任务详情" @close="viewing = null">
    <div class="flex gap-3 mb-5"><span class="priority-badge" :class="viewing.priority">{{ PRIORITIES.find(item => item.value === viewing.priority).label }}</span><span class="status-label" :class="viewing.status">{{ STATUSES.find(item => item.value === viewing.status).label }}</span></div>
    <h3 class="detail-title">{{ viewing.title }}</h3><p class="detail-description">{{ viewing.description || '暂无描述' }}</p>
    <div class="modal-actions"><button class="button secondary" @click="viewing = null">关闭</button><button class="button primary" @click="openForm(viewing)">编辑任务</button></div>
  </AppModal>
  <AppModal v-if="deleting" title="删除任务？" @close="deleting = null">
    <p class="delete-message">确定删除「{{ deleting.title }}」吗？此操作无法撤销。</p><div class="modal-actions"><button class="button secondary" autofocus @click="deleting = null">取消</button><button class="button danger" @click="confirmDelete">确认删除</button></div>
  </AppModal>
</template>
