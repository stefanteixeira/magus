import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { NextRouter } from 'next/router'
import Search from '@/pages/search'
import { SearchProvider } from '@/contexts/SearchContext'
import { GameWithCover } from '@/types/types'
import { formatDate } from '@/utils/format-date'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const pushMock = jest.fn()
const mockedRouter = jest.requireMock('next/router') as jest.Mocked<{
  useRouter: () => Partial<NextRouter>
}>

mockedRouter.useRouter.mockReturnValue({
  query: {},
  push: pushMock,
})

const mockFetch = (mockedGames: GameWithCover[]) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockedGames),
    } as unknown as Response)
  )
}

const mockedGames = [
  {
    id: 143442,
    cover: 130812,
    coverUrl: '/path/to/image1.jpg',
    first_release_date: 974764800,
    genres: [{ name: 'Adventure' }, { name: 'Action' }],
    name: 'Skies of Arcadia',
    platforms: [{ name: 'Dreamcast' }],
    summary:
      'Prince of Persia: Arabian Nights is the Dreamcast port of Prince of Persia 3D...',
  },
  {
    id: 271778,
    cover: 337370,
    coverUrl: '/path/to/image2.jpg',
    first_release_date: 961891200,
    genres: [{ name: 'Role-playing (RPG)' }],
    name: 'Dragon Quest V',
    platforms: [{ name: 'Nintendo DS' }],
    summary:
      'In this Japan-exclusive Super Famicom game, the player assumes the role of an orphan...',
  },
]

const performSearch = async () => {
  const searchName = 'Skies of Arcadia'
  const searchPlatform = 'Dreamcast'

  await userEvent.type(screen.getByTestId('name'), searchName)
  await userEvent.selectOptions(screen.getByTestId('platform'), searchPlatform)
  await userEvent.click(screen.getByTestId('search'))
}

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(
      <SearchProvider>
        <Search />
      </SearchProvider>
    )
  })

  it('renders fields', () => {
    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId('platform')).toBeInTheDocument()
    expect(screen.getByTestId('search')).toBeInTheDocument()
  })

  it('performs a search successfully', async () => {
    await mockFetch(mockedGames)

    await performSearch()

    await waitFor(() => {
      expect(screen.getByTestId('search-result-0')).toBeInTheDocument()
      expect(screen.getByTestId('search-result-1')).toBeInTheDocument()
    })
  })

  it('shows alert when no results are found', async () => {
    await mockFetch([])

    await performSearch()

    await waitFor(() => {
      expect(screen.getByTestId('info-alert')).toBeInTheDocument()
    })
  })

  it('redirects to /new when Add to My Games button is clicked', async () => {
    await mockFetch(mockedGames)

    await performSearch()

    await waitFor(() => {
      expect(screen.getByTestId('add-game-0')).toBeInTheDocument()
      expect(screen.getByTestId('add-game-1')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByTestId('add-game-0'))

    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/new',
      query: {
        coverUrl: mockedGames[0].coverUrl,
        genre: mockedGames[0].genres.map((genre) => genre.name).join(', '),
        igdbId: mockedGames[0].id,
        name: mockedGames[0].name,
        platform: mockedGames[0].platforms
          .map((platform) => platform.name)
          .join(', '),
        releaseDate: formatDate(mockedGames[0].first_release_date),
        summary: mockedGames[0].summary,
      },
    })
  })
})
