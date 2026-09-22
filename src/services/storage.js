import { taskFields } from '../domain/tasks.js'

export const TASKS_KEY = 'youxu.tasks.v1'
export const THEME_KEY = 'youxu.theme.v1'

export function validTasks(value) {
  if (!Array.isArray(value)) return false
  const ids = new Set()
  return value.every(task => {
    if (!task || typeof task.id !== 'string' || !task.id.trim() || ids.has(task.id) || typeof task.description !== 'string') return false
    try { taskFields(task) } catch { return false }
    ids.add(task.id)
    return true
  })
}

export function createStorage(getStorage = () => window.localStorage) {
  function read(key, fallback, validate, label) {
    try {
      const raw = getStorage().getItem(key)
      if (raw === null) return { value: fallback, error: '' }
      const value = JSON.parse(raw)
      if (!validate(value)) throw new Error('invalid data')
      return { value, error: '' }
    } catch {
      return { value: fallback, error: `${label}读取失败，原数据未被覆盖。请检查浏览器存储权限或数据格式后重试。` }
    }
  }
  function write(key, value, label) {
    try { getStorage().setItem(key, JSON.stringify(value)); return '' }
    catch { return `${label}尚未保存到浏览器，请勿刷新或关闭页面。请检查存储权限或可用空间后重试。` }
  }
  return {
    readTasks: () => read(TASKS_KEY, [], validTasks, '任务数据'),
    writeTasks: value => write(TASKS_KEY, value, '任务数据'),
    readTheme: () => read(THEME_KEY, 'light', value => ['light', 'dark'].includes(value), '主题设置'),
    writeTheme: value => write(THEME_KEY, value, '主题设置'),
  }
}
