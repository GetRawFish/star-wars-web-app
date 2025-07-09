import { describe, it, expect } from 'vitest'
import { useFilterByQuery } from '@/composables/useFilterByQuery'

describe('useFilterByQuery', () => {
  const mockData = [
    { name: 'Luke Skywalker', height: '172' },
    { name: 'C-3PO', height: '167' },
    { name: 'R2-D2', height: '96' },
    { name: 'Darth Vader', height: '202' },
  ]

  it('should filter by name field by default', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(mockData, 'skywalker')
    expect(result).toEqual([{ name: 'Luke Skywalker', height: '172' }])
  })

  it('should filter by specified field', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(mockData, '172', 'height')
    expect(result).toEqual([{ name: 'Luke Skywalker', height: '172' }])
  })

  it('should return empty array when no matches found', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(mockData, 'yoda')
    expect(result).toEqual([])
  })

  it('should handle null data', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(null, 'skywalker')
    expect(result).toEqual([])
  })

  it('should be case insensitive', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(mockData, 'lUkE')
    expect(result).toEqual([{ name: 'Luke Skywalker', height: '172' }])
  })

  it('should trim whitespace', () => {
    const { doFilter } = useFilterByQuery()
    const result = doFilter(mockData, '  luke  ')
    expect(result).toEqual([{ name: 'Luke Skywalker', height: '172' }])
  })
})
