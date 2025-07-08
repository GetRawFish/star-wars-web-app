import { describe, it, expect } from 'vitest'
import { useSort } from '@/composables/useSort'
import { SortDirection } from '@/utils/enums'

describe('useSort', () => {
  const mockNames = ['Luke', 'Leia', 'Han', 'Chewbacca']
  const mockDates = ['2020-01-01T00:00:00Z', '2021-01-01T00:00:00Z', '2019-01-01T00:00:00Z']

  it('should sort names in ascending order', () => {
    const { doSortByName } = useSort()
    const sorted = [...mockNames].sort((a, b) => doSortByName(a, b, SortDirection.asc))
    expect(sorted).toEqual(['Chewbacca', 'Han', 'Leia', 'Luke'])
  })

  it('should sort names in descending order', () => {
    const { doSortByName } = useSort()
    const sorted = [...mockNames].sort((a, b) => doSortByName(a, b, SortDirection.desc))
    expect(sorted).toEqual(['Luke', 'Leia', 'Han', 'Chewbacca'])
  })

  it('should sort dates in ascending order', () => {
    const { doSortByDate } = useSort()
    const sorted = [...mockDates].sort((a, b) => doSortByDate(a, b, SortDirection.asc))
    expect(sorted).toEqual(['2019-01-01T00:00:00Z', '2020-01-01T00:00:00Z', '2021-01-01T00:00:00Z'])
  })

  it('should sort dates in descending order', () => {
    const { doSortByDate } = useSort()
    const sorted = [...mockDates].sort((a, b) => doSortByDate(a, b, SortDirection.desc))
    expect(sorted).toEqual(['2021-01-01T00:00:00Z', '2020-01-01T00:00:00Z', '2019-01-01T00:00:00Z'])
  })
})
