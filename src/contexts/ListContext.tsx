import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MyGame } from '@/types/types'
import { DEFAULT_PAGE_SIZE } from '@/pages/list'

export interface ListState {
  games: MyGame[]
  sortField: string
  sortOrder: string
  filterPlatform: string
  filterShelf: string
  filterGenre: string
  filterName: string
  currentPage: number
  pageSize: number
}

interface ListContextType {
  listState: ListState
  setListState: React.Dispatch<React.SetStateAction<Partial<ListState>>>
}

const ListContext = createContext<ListContextType | undefined>(undefined)

export const useList = () => {
  const context = useContext(ListContext)
  if (!context) {
    throw new Error('useList must be used within a ListProvider')
  }
  return context
}

export const ListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [listState, setInternalListState] = useState<ListState>({
    games: [],
    sortField: '',
    sortOrder: '',
    filterPlatform: '',
    filterShelf: '',
    filterGenre: '',
    filterName: '',
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const setListState = (
    newState:
      | Partial<ListState>
      | ((prevState: ListState) => Partial<ListState>)
  ) => {
    setInternalListState((prevState) => ({
      ...prevState,
      ...(typeof newState === 'function' ? newState(prevState) : newState),
    }))
  }

  return (
    <ListContext.Provider value={{ listState, setListState }}>
      {children}
    </ListContext.Provider>
  )
}
