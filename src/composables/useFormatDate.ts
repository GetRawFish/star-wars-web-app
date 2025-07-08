interface UseFormatDateReturn {
  doFormatToLocaleString: (date: string) => string
  doFormatToTime: (date: string) => number
}

export function useFormatDate(): UseFormatDateReturn {
  function doFormatToLocaleString(date: string): string {
    return new Date(date).toLocaleString('en-GB', { timeZone: 'UTC' })
  }
  function doFormatToTime(date: string): number {
    return new Date(date).getTime()
  }

  return { doFormatToLocaleString, doFormatToTime }
}
