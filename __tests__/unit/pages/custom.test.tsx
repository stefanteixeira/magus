import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import CustomGame from '@/pages/custom'
import { NextRouter } from 'next/router'
import { ShelfNames } from '@/types/types'
import dayjs from 'dayjs'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const pushMock = jest.fn()
const mockedRouter = jest.requireMock('next/router') as jest.Mocked<{
  useRouter: () => Partial<NextRouter>
}>

mockedRouter.useRouter.mockReturnValue({
  push: pushMock,
})

const gameData = {
  name: 'Dragon Quest V',
  coverUrl: 'https://some.url',
  platform: 'Nintendo DS',
  genre: 'Role-playing (RPG)',
  releaseDate: 'Dec 15, 2010',
  myRating: '8',
  shelf: ShelfNames.Played,
  summary: 'Some game summary',
}

const fillFormFields = async (gameData: any) => {
  await userEvent.type(screen.getByTestId('name'), gameData.name)
  await userEvent.type(screen.getByTestId('cover-url'), gameData.coverUrl)
  await userEvent.selectOptions(
    screen.getByTestId('platform'),
    gameData.platform
  )
  await userEvent.type(screen.getByTestId('genre'), gameData.genre)

  const releaseDateField = screen.getByTestId('release-date')
  fireEvent.mouseDown(releaseDateField)
  fireEvent.change(releaseDateField, {
    target: { value: gameData.releaseDate },
  })
  const selectedCell = document.querySelector('.rc-picker-cell-selected')
  if (selectedCell) {
    fireEvent.click(selectedCell)
  }

  await userEvent.click(screen.getByTestId(`rating-${gameData.myRating}`))
  await userEvent.click(screen.getByTestId(`shelf-${gameData.shelf}`))
  await userEvent.type(screen.getByTestId('summary'), gameData.summary)
}

describe('CustomGame', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(<CustomGame />)
  })

  it('creates a custom game successfully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock

    await fillFormFields(gameData)

    await userEvent.click(screen.getByTestId('btn-add'))

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const actualBody = JSON.parse(fetchCall.body)

    const expectedBody = {
      name: gameData.name,
      coverUrl: gameData.coverUrl,
      platform: gameData.platform,
      genre: gameData.genre,
      releaseDate: dayjs(gameData.releaseDate).format('YYYY-MM-DD'),
      finishedDate: null,
      myRating: parseInt(gameData.myRating),
      shelfId: Object.keys(ShelfNames).indexOf(gameData.shelf) + 1,
      summary: gameData.summary,
    }

    expect(actualBody).toEqual(expectedBody)
    expect(pushMock).toHaveBeenCalledWith('/list')
  })

  it('navigates back to Home page if Cancel button is clicked', async () => {
    await userEvent.click(screen.getByTestId('btn-cancel'))

    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
