interface UseUtilsReturn {
  isNotEmptyArray: (list?: unknown[]) => boolean
  isEmptyArray: (list?: unknown[]) => boolean
  calcTotalPages: (list?: unknown[], perPage?: number) => number
  chunkArray: (list?: unknown[], currentPage?: number, perPage?: number) => unknown[]
}

const defaultPerPage = 10

export function useUtils(): UseUtilsReturn {
  function isNotEmptyArray(list?: unknown[]): boolean {
    return list !== undefined && list.length > 0
  }
  function isEmptyArray(list?: unknown[]): boolean {
    return list !== undefined && list.length <= 0
  }
  function calcTotalPages(list?: unknown[], perPage = defaultPerPage): number {
    const { ceil } = Math
    return list && list.length > 0 ? ceil(list?.length / perPage) : 1
  }
  function chunkArray(list?: unknown[], currentPage = 1, perPage = defaultPerPage): unknown[] {
    const endIndex = currentPage * perPage
    const startIndex = endIndex - perPage
    return list?.slice(startIndex, endIndex) ?? []
  }

  return { isNotEmptyArray, isEmptyArray, calcTotalPages, chunkArray }
}
