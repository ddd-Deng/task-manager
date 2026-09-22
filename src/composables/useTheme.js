import { readonly, ref, watchEffect } from 'vue'
import { createStorage } from '../services/storage.js'

export function useTheme(storage = createStorage()) {
  const initial = storage.readTheme()
  const theme = ref(initial.value)
  const themeError = ref(initial.error)
  const unsavedTheme = ref(false)
  let loadFailed = !!initial.error
  watchEffect(() => { document.documentElement.dataset.theme = theme.value })
  function persist() {
    themeError.value = storage.writeTheme(theme.value)
    unsavedTheme.value = !!themeError.value
  }
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    loadFailed = false
    persist()
  }
  function retryTheme() {
    if (loadFailed) {
      const result = storage.readTheme()
      theme.value = result.value
      themeError.value = result.error
      loadFailed = !!result.error
    } else persist()
  }
  return { theme: readonly(theme), themeError: readonly(themeError), unsavedTheme: readonly(unsavedTheme), toggleTheme, retryTheme }
}
