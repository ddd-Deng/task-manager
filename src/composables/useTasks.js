import { readonly, ref } from 'vue'
import { taskFields, STATUSES } from '../domain/tasks.js'

export function useTasks() {
  const tasks = ref([])
  function saveTask(input, id) {
    const fields = taskFields(input)
    if (id) {
      if (!tasks.value.some(task => task.id === id)) throw new Error('任务已不存在，请重新打开。')
      tasks.value = tasks.value.map(task => task.id === id ? { id, ...fields } : task)
    } else {
      tasks.value = [...tasks.value, { id: crypto.randomUUID(), ...fields }]
    }
  }
  function removeTask(id) { tasks.value = tasks.value.filter(task => task.id !== id) }
  function moveTask(id, status) {
    if (!STATUSES.some(item => item.value === status)) return
    const task = tasks.value.find(item => item.id === id)
    if (task && task.status !== status) saveTask({ ...task, status }, id)
  }
  return { tasks: readonly(tasks), saveTask, removeTask, moveTask }
}
