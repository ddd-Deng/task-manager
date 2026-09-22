<script setup>
import { reactive, ref } from 'vue'
import AppModal from './AppModal.vue'
import { STATUSES, PRIORITIES, taskFields } from '../domain/tasks.js'
const props = defineProps({ task: { type: Object, default: null } })
const emit = defineEmits(['save', 'close'])
const fields = reactive({ title: props.task?.title ?? '', description: props.task?.description ?? '', status: props.task?.status ?? 'todo', priority: props.task?.priority ?? 'medium' })
const error = ref('')
function submit() {
  try { emit('save', taskFields(fields), props.task?.id); error.value = '' }
  catch (cause) { error.value = cause.message }
}
</script>

<template>
  <AppModal :title="task ? '编辑任务' : '新建任务'" @close="emit('close')">
    <p class="modal-subtitle">把下一步写下来，让行动更清晰。</p>
    <form novalidate @submit.prevent="submit">
      <label class="field">任务标题 <span class="required">*</span><input v-model="fields.title" autofocus required placeholder="准备完成什么？" :aria-invalid="!!error" :aria-describedby="error ? 'form-error' : undefined" /></label>
      <label class="field">任务描述 <span class="optional">选填</span><textarea v-model="fields.description" rows="4" placeholder="补充细节、想法或完成标准…"></textarea></label>
      <div class="grid grid-cols-2 gap-4">
        <label class="field">任务状态<select v-model="fields.status"><option v-for="item in STATUSES" :key="item.value" :value="item.value">{{ item.label }}</option></select></label>
        <label class="field">优先级<select v-model="fields.priority"><option v-for="item in PRIORITIES" :key="item.value" :value="item.value">{{ item.label }}</option></select></label>
      </div>
      <p v-if="error" id="form-error" class="form-error" role="alert">{{ error }}</p>
      <div class="modal-actions"><button type="button" class="button secondary" @click="emit('close')">取消</button><button type="submit" class="button primary">{{ task ? '保存修改' : '创建任务' }}</button></div>
    </form>
  </AppModal>
</template>
