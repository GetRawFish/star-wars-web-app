import { useFormatDate } from '@/composables/useFormatDate'
import { SortDirection } from '@/types/enums'

interface UseFormatDateReturn {
  doSortByName: (a: string, b: string, direction: SortDirection) => number
  doSortByDate: (a: string, b: string, direction: SortDirection) => number
}

export function useSort(): UseFormatDateReturn {
  function doSortByName(a: string, b: string, direction: SortDirection): number {
    const compareResult = a.localeCompare(b)
    return direction === SortDirection.asc ? compareResult : -compareResult
  }
  function doSortByDate(a: string, b: string, direction: SortDirection): number {
    const { doFormatToTime } = useFormatDate()
    const compareResult = doFormatToTime(a) - doFormatToTime(b)
    return direction === SortDirection.asc ? compareResult : -compareResult
  }

  return { doSortByName, doSortByDate }
}
