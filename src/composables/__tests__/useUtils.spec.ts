import { describe, it, expect } from 'vitest'
import { useUtils } from '@/composables/useUtils'

describe('useUtils', () => {
  const mockList = Array(25).fill({ name: 'item' })

  it('should check if array is not empty', () => {
    const { isNotEmptyArray } = useUtils()
    expect(isNotEmptyArray(mockList)).toBe(true)
    expect(isNotEmptyArray([])).toBe(false)
    expect(isNotEmptyArray(undefined)).toBe(false)
  })

  it('should check if array is empty', () => {
    const { isEmptyArray } = useUtils()
    expect(isEmptyArray([])).toBe(true)
    expect(isEmptyArray(mockList)).toBe(false)
    expect(isEmptyArray(undefined)).toBe(false)
  })

  it('should calculate total pages', () => {
    const { calcTotalPages } = useUtils()
    expect(calcTotalPages(mockList, 10)).toBe(3)
    expect(calcTotalPages(mockList, 5)).toBe(5)
    expect(calcTotalPages([], 10)).toBe(1)
    expect(calcTotalPages(undefined, 10)).toBe(1)
  })

  it('should chunk array correctly', () => {
    const { chunkArray } = useUtils()
    const smallList = [1, 2, 3, 4, 5]

    // First page
    expect(chunkArray(smallList, 1, 2)).toEqual([1, 2])
    // Second page
    expect(chunkArray(smallList, 2, 2)).toEqual([3, 4])
    // Third page (partial)
    expect(chunkArray(smallList, 3, 2)).toEqual([5])
    // Empty case
    expect(chunkArray([], 1, 10)).toEqual([])
    expect(chunkArray(undefined, 1, 10)).toEqual([])
  })
})
