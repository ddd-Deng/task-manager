import { readonly, ref } from 'vue'
import { taskFields, STATUSES } from '../domain/tasks.js'
import { createStorage } from '../services/storage.js'

export function useTasks(storage = createStorage()) {
  const initial = storage.readTasks()
  const tasks = ref(initial.value)
  const storageError = ref(initial.error)
  const loadFailed = ref(!!initial.error)
  const unsaved = ref(false)
  function persist() {
    storageError.value = storage.writeTasks(tasks.value)
    unsaved.value = !!storageError.value
  }
  function retryStorage() {
    if (loadFailed.value) {
      const result = storage.readTasks()
      tasks.value = result.value
      storageError.value = result.error
      loadFailed.value = !!result.error
    } else persist()
  }
  function saveTask(input, id) {
    if (loadFailed.value) return false
    const fields = taskFields(input)
    if (id) {
      if (!tasks.value.some(task => task.id === id)) throw new Error('任务已不存在，请重新打开。')
      tasks.value = tasks.value.map(task => task.id === id ? { id, ...fields } : task)
    } else {
      tasks.value = [...tasks.value, { id: crypto.randomUUID(), ...fields }]
    }
    persist()
    return true
  }
  function removeTask(id) {
    if (loadFailed.value) return
    tasks.value = tasks.value.filter(task => task.id !== id)
    persist()
  }
  function moveTask(id, status) {
    if (!STATUSES.some(item => item.value === status)) return
    const task = tasks.value.find(item => item.id === id)
    if (task && task.status !== status) saveTask({ ...task, status }, id)
  }
  return { tasks: readonly(tasks), storageError: readonly(storageError), loadFailed: readonly(loadFailed), unsaved: readonly(unsaved), saveTask, removeTask, moveTask, retryStorage }
}
