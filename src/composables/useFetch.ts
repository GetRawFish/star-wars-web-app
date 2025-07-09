import { ref, type Ref } from 'vue'
import type { Resource } from '@/types/interfaces'

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  doFetch: () => Promise<void>
}

export function useFetch<T = unknown>(url: string): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function doFetch(): Promise<void> {
    loading.value = true
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = (await response.json()) as T
    } catch (err) {
      console.error(`Error fetching people data:`, err)
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, doFetch }
}

// Helper function to fetch and extract specific fields from set of individual resource URLs
export async function useFetchResources(
  urls: string[],
  field = 'name',
): Promise<(string | undefined)[]> {
  return Promise.all(
    urls.map(async (url) => {
      const { data, doFetch } = useFetch<Resource>(url)
      await doFetch()
      return data.value?.[field]
    }),
  )
}
