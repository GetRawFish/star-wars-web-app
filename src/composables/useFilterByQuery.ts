interface UseQueryReturn<T> {
  doFilter: (data: T | null, query: string, field?: string) => T | null
}

export function useFilterByQuery<T = unknown>(): UseQueryReturn<T> {
  function resetString(text?: string | null): string {
    return text ? text.trim().toLowerCase() : ''
  }

  function doFilter(data: T | null, query: string, field = 'name'): T | null {
    let filteredData = Array.isArray(data) ? data : [[] as T | null]
    if (filteredData && resetString(query).length > 0) {
      filteredData = filteredData.filter((d) => {
        if (d === null) return false
        const fieldValue = (d as Record<string, unknown>)[field]
        return resetString(fieldValue as string | null).includes(resetString(query))
      })
    }

    return filteredData as T | null
  }

  return { doFilter }
}
