import React from 'react'
import { render, screen } from '@testing-library/react'
import GameDetails from '@/pages/details/[id]'
import { MyGame, ShelfNames } from '@/types/types'
import { GetServerSidePropsContext } from 'next'
import dayjs from 'dayjs'
import { act } from 'react-dom/test-utils'

const gameData = {
  id: 1,
  name: 'Lagrange Point',
  genre: 'Role-Playing (RPG)',
  platform: 'Famicom',
  releaseDate: '1994-01-15',
  finishedDate: '2021-10-20',
  myRating: 7,
  shelfId: 3,
  howLongToBeat: 25,
  summary: 'Some game summary',
  coverImage: 'somebase64imagestring',
}

global.fetch = jest.fn((url) =>
  Promise.resolve({
    json: () => Promise.resolve(gameData),
  })
) as jest.Mock

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { id: '1' },
  }),
}))

describe('GameDetails', () => {
  beforeEach(async () => {
    const mockContext = {
      query: { id: '1' },
      req: {} as any,
      res: {} as any,
      resolvedUrl: '/details',
    } as unknown as GetServerSidePropsContext

    const { getServerSideProps } = require('../../../../src/pages/details/[id]')

    const { props } = await getServerSideProps(mockContext)

    await act(async () => {
      render(<GameDetails game={props.game as MyGame} />)
    })
  })

  it('renders game details information', async () => {
    const shelfNames = Object.values(ShelfNames)

    expect(screen.getByText(gameData.name)).toBeInTheDocument()
    expect(screen.getByText(gameData.genre)).toBeInTheDocument()
    expect(screen.getByText(gameData.platform)).toBeInTheDocument()
    expect(
      screen.getByText(dayjs(gameData.releaseDate).format('MMM D, YYYY'))
    ).toBeInTheDocument()
    expect(
      screen.getByText(dayjs(gameData.finishedDate).format('MMM D, YYYY'))
    ).toBeInTheDocument()
    expect(screen.getByText(gameData.summary)).toBeInTheDocument()
    expect(screen.getByTestId('hltb')).toHaveTextContent(
      gameData.howLongToBeat.toString()
    )
    expect(
      screen.getByRole('img', { name: `${gameData.name} cover` })
    ).toBeInTheDocument()
    expect(screen.getByTestId(`rating-${gameData.myRating}`)).toBeChecked()
    expect(
      screen.getByTestId(`shelf-${shelfNames[gameData.shelfId - 1]}`)
    ).toHaveClass('bg-blue-500')
  })
})
