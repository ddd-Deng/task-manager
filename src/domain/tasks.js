export const STATUSES = [
  { value: 'todo', label: '待办', hint: '收集想法，准备出发', symbol: '○' },
  { value: 'doing', label: '进行中', hint: '保持专注，稳步推进', symbol: '◐' },
  { value: 'done', label: '完成', hint: '每一份努力，都有回响', symbol: '✓' },
]
export const PRIORITIES = [
  { value: 'high', label: '高优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'low', label: '低优先级' },
]

export function taskFields(input) {
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  if (!title) throw new Error('请输入任务标题，不能只填写空格。')
  if (!STATUSES.some(item => item.value === input.status)) throw new Error('请选择有效的任务状态。')
  if (!PRIORITIES.some(item => item.value === input.priority)) throw new Error('请选择有效的优先级。')
  return { title, description: typeof input.description === 'string' ? input.description.trim() : '', status: input.status, priority: input.priority }
}
