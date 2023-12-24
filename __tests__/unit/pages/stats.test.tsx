import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Stats from '@/pages/stats'
import { StatsProvider } from '@/contexts/StatsContext'
import userEvent from '@testing-library/user-event'

const mockFinishedYears = ['2022', '2024']
const mockGames = [
  {
    id: 1,
    coverImage: Buffer.from('Game image', 'utf-8'),
    name: 'Child of Light',
    finishedDate: '2024-04-27',
  },
  {
    id: 2,
    coverImage: Buffer.from('Game image', 'utf-8'),
    name: 'Gato Roboto',
    finishedDate: '2022-06-15',
  },
]

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ games: mockGames }),
  })
) as jest.Mock

describe('Stats', () => {
  beforeEach(async () => {
    render(
      <StatsProvider>
        <Stats finishedYears={mockFinishedYears} />
      </StatsProvider>
    )
  })

  it('renders fields', () => {
    expect(screen.getByTestId('filter-year')).toBeInTheDocument()
    expect(screen.getByTestId('sort-field')).toBeInTheDocument()
    expect(screen.getByTestId('sort-order')).toBeInTheDocument()
  })

  it('loads games based on the selected year', async () => {
    await userEvent.selectOptions(screen.getByTestId('filter-year'), '2022')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('finishedYear=2022')
      )
    })
    expect(screen.getAllByTestId('game-cover')).toHaveLength(mockGames.length)
  })
})
