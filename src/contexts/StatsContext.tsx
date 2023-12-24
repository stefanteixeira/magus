import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { MyGame } from '@/types/types'

interface StatsContextType {
  year: string
  setYear: (year: string) => void
  games: MyGame[]
  setGames: (games: MyGame[]) => void
  sortField: string
  setSortField: (field: string) => void
  sortOrder: string
  setSortOrder: (order: string) => void
  fetchGames: () => Promise<void>
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

export const useStats = () => {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
}

export const StatsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [year, setYear] = useState('')
  const [games, setGames] = useState<MyGame[]>([])
  const [sortField, setSortField] = useState('finished_date')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchGames = useCallback(async () => {
    if (year) {
      let queryString = `/api/list?sortField=${sortField}&sortOrder=${sortOrder}&filterShelf=2&finishedYear=${year}&limit=100`
      const response = await fetch(queryString)
      const data = await response.json()
      setGames(data.games)
    }
  }, [year, sortField, sortOrder])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  return (
    <StatsContext.Provider
      value={{
        year,
        setYear,
        games,
        setGames,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        fetchGames,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}
