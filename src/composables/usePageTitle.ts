import { ref, watchEffect } from 'vue'

export function usePageTitle(newTitle: string) {
  const title = ref(newTitle)

  watchEffect(() => {
    document.title = title.value
  })

  return { title }
}
