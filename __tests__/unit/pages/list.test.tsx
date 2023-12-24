import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import List from '@/pages/list'
import { useRouter } from 'next/router'
import { act } from 'react-dom/test-utils'
import { ListProvider } from '@/contexts/ListContext'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const mockGames = [
  {
    id: 1,
    igdbId: 5487,
    coverUrl: 'https://some.url',
    coverImage: Buffer.from('Game image', 'utf-8'),
    myRating: 9,
    name: 'Chrono Trigger',
    platform: 'Super Nintendo Entertainment System',
    genre: 'Role-playing (RPG)',
    releaseDate: '1996-05-13',
    finishedDate: '2020-01-25',
    summary: 'Some game summary',
    howLongToBeat: 25,
    shelfId: 3,
  },
  {
    id: 2,
    igdbId: 7165,
    coverUrl: 'https://some.url',
    coverImage: Buffer.from('Game image', 'utf-8'),
    myRating: 7,
    name: 'Castlevania',
    platform: 'Nintendo 64',
    genre: 'Adventure',
    releaseDate: '2013-04-15',
    finishedDate: '2014-01-01',
    summary: 'Some game summary',
    howLongToBeat: 30,
    shelfId: 2,
  },
  {
    id: 1,
    coverUrl: 'https://some.url',
    coverImage: Buffer.from('Game image', 'utf-8'),
    name: 'Saint Seiya RPG: Asgard Chapter',
    platform: 'PC (Microsoft Windows)',
    genre: 'Role-playing (RPG)',
    releaseDate: '2000-01-02',
    summary: 'Some game summary',
  },
]

const mockGenres = [
  'Action',
  'Adventure',
  'Fighting',
  'Platform',
  'Role-playing (RPG)',
  'Visual Novel',
]

describe('List', () => {
  const pushMock = jest.fn()

  beforeEach(async () => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          games: mockGames,
          gamesCount: mockGames.length,
          genres: mockGenres,
        }),
    })

    await act(async () => {
      render(
        <ListProvider>
          <List games={mockGames} genres={mockGenres} />
        </ListProvider>
      )
    })
  })

  it('renders games list with proper count', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('games-count')).toHaveTextContent(
        mockGames.length.toString()
      )
    })

    for (const mockGame of mockGames) {
      expect(screen.getByText(mockGame.name)).toBeInTheDocument()
    }
  })
})
