import { describe, it, expect } from 'vitest'
import { useFormatDate } from '@/composables/useFormatDate'

describe('useFormatDate', () => {
  const mockDate = '2020-01-01T00:00:00Z'

  it('should format date to locale string', () => {
    const { doFormatToLocaleString } = useFormatDate()
    const result = doFormatToLocaleString(mockDate)
    expect(result).toMatch(/01\/01\/2020, 00:00:00/) // en-GB format
  })

  it('should format date to timestamp', () => {
    const { doFormatToTime } = useFormatDate()
    const result = doFormatToTime(mockDate)
    expect(result).toBe(new Date(mockDate).getTime())
  })

  it('should handle invalid date strings', () => {
    const { doFormatToLocaleString, doFormatToTime } = useFormatDate()
    const invalidDate = 'invalid-date'

    const localeResult = doFormatToLocaleString(invalidDate)
    expect(localeResult).toBe('Invalid Date')

    const timeResult = doFormatToTime(invalidDate)
    expect(timeResult).toBeNaN()
  })
})
