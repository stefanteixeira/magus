import React, { createContext, useState, useContext, ReactNode } from 'react'
import { Game } from '@/types/types'

interface SearchContextType {
  searchResultsState: Game[]
  setSearchResultsState: (games: Game[]) => void
  gameName: string
  setGameName: (name: string) => void
  platform: string
  setPlatform: (platform: string) => void
}

type SearchProviderProps = {
  children: ReactNode
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResultsState, setSearchResultsState] = useState<Game[]>([])
  const [gameName, setGameName] = useState('')
  const [platform, setPlatform] = useState('')

  return (
    <SearchContext.Provider
      value={{
        searchResultsState,
        setSearchResultsState,
        gameName,
        setGameName,
        platform,
        setPlatform,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
