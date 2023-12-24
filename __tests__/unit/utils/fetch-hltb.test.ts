import fetchHltbData from '@/utils/fetch-hltb'

global.fetch = jest.fn()

describe('fetchHltbData', () => {
  const mockSetHltbData = jest.fn()
  const mockSetHltbError = jest.fn()
  const mockName = 'Street Fighter II'
  const mockPlatform = 'SNES'
  let fetchSpy: any

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch')
    jest.clearAllMocks()
  })

  afterEach(() => {
    fetchSpy.mockRestore()
  })

  it('sets HLTB data correctly on successful fetch', async () => {
    const mockResponse = { gameplayMain: 15 }
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    )

    await fetchHltbData(
      mockName,
      mockPlatform,
      mockSetHltbData,
      mockSetHltbError
    )

    expect(mockSetHltbData).toHaveBeenCalledWith('15')
    expect(mockSetHltbError).toHaveBeenCalledWith('')
  })

  it('sets HLTB data from gameplayMainExtra when gameplayMain is absent', async () => {
    const mockResponse = { gameplayMainExtra: 20 }
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    )

    await fetchHltbData(
      mockName,
      mockPlatform,
      mockSetHltbData,
      mockSetHltbError
    )

    expect(mockSetHltbData).toHaveBeenCalledWith('20')
    expect(mockSetHltbError).toHaveBeenCalledWith('')
  })

  it('fetches data from GF when HLTB data is not found', async () => {
    const mockHltbResponse = {}
    const mockGfResponse = { length: '10' }
    fetchSpy
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHltbResponse),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGfResponse),
        })
      )

    await fetchHltbData(
      mockName,
      mockPlatform,
      mockSetHltbData,
      mockSetHltbError
    )

    expect(mockSetHltbData).toHaveBeenCalledWith('10')
    expect(mockSetHltbError).toHaveBeenCalledWith('')
  })

  it('sets HLTB error message when no data is found', async () => {
    fetchSpy
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )

    await fetchHltbData(
      mockName,
      mockPlatform,
      mockSetHltbData,
      mockSetHltbError
    )

    expect(mockSetHltbData).toHaveBeenCalledWith('')
    expect(mockSetHltbError).toHaveBeenCalledWith('No HLTB data found')
  })

  it('handles fetch errors correctly', async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch error'))
    )

    await fetchHltbData(
      mockName,
      mockPlatform,
      mockSetHltbData,
      mockSetHltbError
    )

    expect(mockSetHltbData).not.toHaveBeenCalled()
    expect(mockSetHltbError).toHaveBeenCalledWith('Fetch error')
  })
})
