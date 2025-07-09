import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetch, useFetchResources } from '@/composables/useFetch'

// Mock the global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as typeof global.fetch

describe('useFetch', () => {
  const mockUrl = 'https://swapi.info/api/people/1'
  const mockPeopleData = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    birth_year: '19BBY',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with default values', () => {
    const { data, error, loading } = useFetch(mockUrl)

    expect(data.value).toBeNull()
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('should fetch people data successfully from SWAPI', async () => {
    // Mock a successful SWAPI response
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPeopleData),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    const { data, error, loading, doFetch } = useFetch(mockUrl)

    await doFetch()

    expect(mockFetch).toHaveBeenCalledWith(mockUrl)
    expect(data.value).toEqual(mockPeopleData)
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('should handle SWAPI 404 errors', async () => {
    // Mock a failed SWAPI response
    const mockResponse = {
      ok: false,
      status: 404,
      json: vi.fn().mockRejectedValue(new Error('Not found')),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    const { data, error, loading, doFetch } = useFetch(mockUrl)

    await doFetch()

    expect(mockFetch).toHaveBeenCalledWith(mockUrl)
    expect(data.value).toBeNull()
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toBe('HTTP error! status: 404')
    expect(loading.value).toBe(false)
  })

  it('should handle network errors when SWAPI is down', async () => {
    // Mock a network failure
    const mockError = new Error('Failed to fetch')
    mockFetch.mockRejectedValue(mockError)

    const { data, error, loading, doFetch } = useFetch(mockUrl)

    await doFetch()

    expect(mockFetch).toHaveBeenCalledWith(mockUrl)
    expect(data.value).toBeNull()
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toBe('Failed to fetch')
    expect(loading.value).toBe(false)
  })

  it('should update loading state correctly during SWAPI fetch', async () => {
    // Mock a delayed SWAPI response to test loading state
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPeopleData),
    } as unknown as Response

    mockFetch.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100)),
    )

    const { loading, doFetch } = useFetch(mockUrl)

    const fetchPromise = doFetch()
    expect(loading.value).toBe(true)

    await fetchPromise
    expect(loading.value).toBe(false)
  })
})

describe('useFetchResources', () => {
  const mockUrls = [
    'https://swapi.info/api/people/1',
    'https://swapi.info/api/people/2',
    'https://swapi.info/api/people/3',
  ]
  const mockPeopleResponses = [
    { name: 'Luke Skywalker', height: '172' },
    { name: 'C-3PO', height: '167' },
    { name: 'R2-D2', height: '96' },
  ]

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch multiple people resources from SWAPI and extract names', async () => {
    // Mock responses for each SWAPI URL
    mockUrls.forEach((url, index) => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockPeopleResponses[index]),
      } as unknown as Response
      mockFetch.mockResolvedValueOnce(mockResponse)
    })

    const result = await useFetchResources(mockUrls, 'name')

    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result).toEqual(['Luke Skywalker', 'C-3PO', 'R2-D2'])
  })

  it('should fetch multiple people resources and extract specified field', async () => {
    // Mock responses for each SWAPI URL
    mockUrls.forEach((url, index) => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockPeopleResponses[index]),
      } as unknown as Response
      mockFetch.mockResolvedValueOnce(mockResponse)
    })

    const result = await useFetchResources(mockUrls, 'height')

    expect(result).toEqual(['172', '167', '96'])
  })

  it('should handle errors in individual SWAPI requests', async () => {
    // First two requests succeed, third fails
    const mockResponse1 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPeopleResponses[0]),
    } as unknown as Response
    const mockResponse2 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPeopleResponses[1]),
    } as unknown as Response
    const mockResponse3 = {
      ok: false,
      status: 404,
    } as Response

    mockFetch.mockResolvedValueOnce(mockResponse1)
    mockFetch.mockResolvedValueOnce(mockResponse2)
    mockFetch.mockResolvedValueOnce(mockResponse3)

    const result = await useFetchResources(mockUrls, 'name')

    // The failing request will result in undefined for that item
    expect(result).toEqual(['Luke Skywalker', 'C-3PO', undefined])
  })

  it('should return undefined for missing fields', async () => {
    // Mock responses with missing 'name' field
    const mockResponses = [{ height: '172' }, { height: '167' }, { height: '96' }]

    mockUrls.forEach((url, index) => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponses[index]),
      } as unknown as Response
      mockFetch.mockResolvedValueOnce(mockResponse)
    })

    const result = await useFetchResources(mockUrls, 'name')

    expect(result).toEqual([undefined, undefined, undefined])
  })
})
