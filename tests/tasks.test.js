import test from 'node:test'
import assert from 'node:assert/strict'
import { taskFields } from '../src/domain/tasks.js'
import { createStorage, TASKS_KEY, THEME_KEY } from '../src/services/storage.js'
import { useTasks } from '../src/composables/useTasks.js'

const sample = { title: '  准备演示  ', description: '', status: 'todo', priority: 'medium' }
function memoryStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}
test('标题去除首尾空格，拒绝空白与无效枚举', () => {
  assert.equal(taskFields(sample).title, '准备演示')
  for (const change of [{ title: ' \n ' }, { status: 'invalid' }, { priority: 'urgent' }]) assert.throws(() => taskFields({ ...sample, ...change }))
})
test('新增、修改、状态迁移和删除在重新读取后保持一致', () => {
  const memory = memoryStorage()
  const storage = createStorage(() => memory)
  const model = useTasks(storage)
  model.saveTask(sample)
  const id = model.tasks.value[0].id
  model.saveTask({ ...sample, title: '修改后的任务', priority: 'high' }, id)
  model.moveTask(id, 'doing')
  assert.equal(useTasks(storage).tasks.value[0].status, 'doing')
  assert.equal(useTasks(storage).tasks.value[0].priority, 'high')
  model.moveTask(id, 'done')
  assert.equal(useTasks(storage).tasks.value[0].status, 'done')
  model.moveTask(id, 'invalid')
  assert.equal(model.tasks.value[0].status, 'done')
  model.removeTask(id)
  assert.deepEqual(useTasks(storage).tasks.value, [])
})
test('损坏的数据不被覆盖，修复后可以重试读取', () => {
  const memory = memoryStorage()
  const storage = createStorage(() => memory)
  for (const raw of ['{broken', '{}', '[null]', JSON.stringify([{ id: '1', ...sample }, { id: '1', ...sample }]), JSON.stringify([{ id: '1', ...sample, status: 'bad' }])]) {
    memory.setItem(TASKS_KEY, raw)
    const model = useTasks(storage)
    assert.equal(model.loadFailed.value, true)
    assert.equal(model.saveTask(sample), false)
    assert.equal(memory.getItem(TASKS_KEY), raw)
    memory.setItem(TASKS_KEY, '[]')
    model.retryStorage()
    assert.equal(model.loadFailed.value, false)
  }
})
test('写入失败保留内存数据并标记未保存，重试可以恢复', () => {
  const memory = memoryStorage()
  let fail = true
  const storage = createStorage(() => ({ getItem: memory.getItem, setItem: (...args) => { if (fail) throw new Error('QuotaExceededError'); memory.setItem(...args) } }))
  const model = useTasks(storage)
  model.saveTask(sample)
  assert.equal(model.tasks.value.length, 1)
  assert.equal(model.unsaved.value, true)
  assert.match(model.storageError.value, /尚未保存/)
  fail = false
  model.retryStorage()
  assert.equal(model.unsaved.value, false)
  assert.equal(useTasks(storage).tasks.value.length, 1)
})
test('localStorage 访问被禁止时可控失败', () => {
  const storage = createStorage(() => { throw new Error('SecurityError') })
  assert.match(storage.readTasks().error, /读取失败/)
  assert.match(storage.writeTasks([]), /尚未保存/)
})
test('主题默认浅色，深色可保存，无效主题有提示', () => {
  const memory = memoryStorage()
  const storage = createStorage(() => memory)
  assert.equal(storage.readTheme().value, 'light')
  assert.equal(storage.writeTheme('dark'), '')
  assert.equal(storage.readTheme().value, 'dark')
  memory.setItem(THEME_KEY, '"invalid"')
  assert.match(storage.readTheme().error, /读取失败/)
})
