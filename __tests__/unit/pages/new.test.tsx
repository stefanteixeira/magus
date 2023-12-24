import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import NewGame from '@/pages/new'
import { NextRouter } from 'next/router'
import { ShelfNames } from '@/types/types'
import dayjs from 'dayjs'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const pushMock = jest.fn()

const mockQueryParams = {
  igdbId: '123321',
  name: 'Chrono Trigger',
  coverUrl: 'https://some.url',
  platform: 'Super Nintendo Entertainment System',
  genre: 'Role-playing (RPG)',
  releaseDate: 'Oct 20, 2001',
  summary: 'Some game summary',
}

const gameData = {
  ...mockQueryParams,
  myRating: '8',
  shelf: ShelfNames.Wishlist,
}

const fillFormFields = async (gameData: any) => {
  await userEvent.click(screen.getByTestId('platform_0'))
  await userEvent.click(screen.getByTestId(`rating-${gameData.myRating}`))
  await userEvent.click(screen.getByTestId(`shelf-${gameData.shelf}`))
}

const mockedRouter = jest.requireMock('next/router') as jest.Mocked<{
  useRouter: () => Partial<NextRouter>
}>
mockedRouter.useRouter.mockReturnValue({
  push: pushMock,
  query: mockQueryParams,
})

describe('NewGame', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(<NewGame />)
  })

  it('sets fields with values from query parameters', async () => {
    expect(screen.getByTestId('igdb-id')).toHaveValue(mockQueryParams.igdbId)
    expect(screen.getByTestId('name')).toHaveValue(mockQueryParams.name)
    expect(screen.getByTestId('cover-url')).toHaveValue(
      mockQueryParams.coverUrl
    )
    expect(screen.getByTestId('platform_0')).not.toBeChecked()
    expect(screen.getByText(mockQueryParams.platform)).toBeInTheDocument()
    expect(screen.getByTestId('genre')).toHaveValue(mockQueryParams.genre)
    expect(screen.getByTestId('release-date')).toHaveValue(
      mockQueryParams.releaseDate
    )
    expect(screen.getByTestId('summary')).toHaveValue(mockQueryParams.summary)
  })

  it('adds a game successfully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock

    await fillFormFields(gameData)

    await userEvent.click(screen.getByTestId('btn-add'))

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const actualBody = JSON.parse(fetchCall.body)

    const expectedBody = {
      igdbId: gameData.igdbId,
      name: gameData.name,
      coverUrl: gameData.coverUrl,
      platform: gameData.platform,
      genre: gameData.genre,
      releaseDate: dayjs(gameData.releaseDate).format('YYYY-MM-DD'),
      finishedDate: null,
      myRating: parseInt(gameData.myRating),
      shelfId: Object.keys(ShelfNames).indexOf(gameData.shelf) + 1,
      howLongToBeat: null,
      difficulty: null,
      summary: gameData.summary,
    }

    expect(actualBody).toEqual(expectedBody)
    expect(pushMock).toHaveBeenCalledWith('/search')
  })

  it('navigates back to Home page if Cancel button is clicked', async () => {
    await userEvent.click(screen.getByTestId('btn-cancel'))

    expect(pushMock).toHaveBeenCalledWith('/search')
  })
})
