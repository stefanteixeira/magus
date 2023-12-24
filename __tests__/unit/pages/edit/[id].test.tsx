import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import EditGame from '@/pages/edit/[id]'
import { useRouter } from 'next/router'
import { act } from 'react-dom/test-utils'
import dayjs from 'dayjs'

const mockGameData = {
  id: 1001,
  coverUrl: 'https://some.url',
  name: 'Pokemon Crystal',
  platform: 'Game Boy Color',
  genre: 'Role-playing (RPG)',
  releaseDate: '1999-01-13',
  finishedDate: '2005-03-12',
  myRating: 9,
  summary: 'Some game summary',
  howLongToBeat: 33,
  difficulty: 5,
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const pushMock = jest.fn()

describe('EditGame', () => {
  beforeEach(async () => {
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { id: mockGameData.id },
      push: pushMock,
    })

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGameData),
      })
    ) as jest.Mock

    await act(async () => {
      render(<EditGame />)
    })
  })

  it('sets fields with values from the game to edit', async () => {
    await waitFor(() => expect(screen.getByTestId('name')).toBeInTheDocument())

    expect(screen.getByTestId('name')).toHaveValue(mockGameData.name)
    expect(screen.getByTestId('cover-url')).toHaveValue(mockGameData.coverUrl)
    expect(screen.getByTestId('platform')).toHaveValue(mockGameData.platform)
    expect(screen.getByTestId('genre')).toHaveValue(mockGameData.genre)
    expect(screen.getByTestId('release-date')).toHaveValue(
      dayjs(mockGameData.releaseDate).format('MMM D, YYYY')
    )
    expect(screen.getByTestId('finished-date')).toHaveValue(
      dayjs(mockGameData.finishedDate).format('MMM D, YYYY')
    )
    expect(screen.getByTestId(`rating-${mockGameData.myRating}`)).toBeChecked()
    expect(screen.getByTestId('summary')).toHaveValue(mockGameData.summary)
    expect(screen.getByTestId('hltb')).toHaveValue(mockGameData.howLongToBeat)
    expect(screen.getByTestId('game-difficulty')).toHaveValue(
      String(mockGameData.difficulty)
    )
  })

  it('updates game data on submit', async () => {
    const newName = 'Pokemon Jade'
    const nameField = screen.getByTestId('name')

    await userEvent.clear(nameField)
    await userEvent.type(nameField, newName)

    await userEvent.click(screen.getByTestId('btn-edit'))

    await waitFor(() => {
      const { id, ...mockGameDataWithoutId } = mockGameData

      const expectedBody = {
        ...mockGameDataWithoutId,
        name: newName,
      }

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/edit?id=${mockGameData.id}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(expectedBody),
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    expect(pushMock).toHaveBeenCalledWith('/list')
  })

  it('navigates back to List page if Cancel button is clicked', async () => {
    await userEvent.click(screen.getByTestId('btn-cancel'))

    expect(pushMock).toHaveBeenCalledWith('/list')
  })
})
