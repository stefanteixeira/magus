import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { MyGame, ShelfNames } from '@/types/types'
import StarRating from '@/components/StarRating'
import Breadcrumbs from '@/components/Breadcrumbs'
import Shelves from '@/components/Shelves'
import { PLATFORM_OPTIONS } from '@/constants/platforms'
import dayjs from 'dayjs'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { useList } from '@/contexts/ListContext'
import isEqual from 'lodash/isEqual'
import ConfirmationModal from '@/components/ConfirmationModal'
import { DIFFICULTY } from '@/constants/difficulty'
import { debounce } from 'lodash'

interface ListProps {
  games: MyGame[]
  genres: string[]
}

export const DEFAULT_PAGE_SIZE = 30
export const MAX_DISPLAY_PAGES = 4

const List: React.FC<ListProps> = ({ games, genres }) => {
  const [sortDirection, setSortDirection] = useState<{
    [key: string]: 'asc' | 'desc'
  }>({})
  const [gamesCount, setGamesCount] = useState(0)
  const { listState, setListState } = useList()
  const [nameInputValue, setNameInputValue] = useState(listState.filterName)
  const [shouldFetchGames, setShouldFetchGames] = useState(true)
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)

  const router = useRouter()

  const fetchGames = useCallback(async () => {
    let queryString = `/api/list?page=${listState.currentPage}&limit=${listState.pageSize}`

    if (listState.sortField && listState.sortOrder) {
      queryString += `&sortField=${listState.sortField}&sortOrder=${listState.sortOrder}`
    }
    if (listState.filterPlatform) {
      queryString += `&filterPlatform=${listState.filterPlatform}`
    }
    if (listState.filterShelf) {
      queryString += `&filterShelf=${listState.filterShelf}`
    }
    if (listState.filterGenre) {
      queryString += `&filterGenre=${listState.filterGenre}`
    }
    if (listState.filterName) {
      queryString += `&filterName=${listState.filterName}`
    }

    const response = await fetch(queryString)
    const data = await response.json()
    if (data.games && !isEqual(data.games, listState.games)) {
      setListState({ games: data.games || [] })
    }
    setGamesCount(data.gamesCount)
  }, [listState, setListState])

  useEffect(() => {
    if (shouldFetchGames) {
      fetchGames()
      setShouldFetchGames(false)
    }
  }, [shouldFetchGames, fetchGames])

  const clearFilters = () => {
    setListState({
      games: games,
      sortField: '',
      sortOrder: '',
      filterPlatform: '',
      filterShelf: '',
      filterGenre: '',
      filterName: '',
      currentPage: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    })
    setNameInputValue('')
    setShouldFetchGames(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/delete?id=${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      setListState((prevState) => {
        const currentGames = prevState.games || []

        const updatedGames = currentGames.filter((game) => game.id !== id)
        return { ...prevState, games: updatedGames }
      })

      setGamesCount((prevCount) => prevCount - 1)
    } catch (error: any) {
      alert(error.message)
    }
  }

  const updateRatingState = (gameId: number, rating: number) => {
    setListState((prevState) => {
      const currentGames = prevState.games || []

      const updatedGames = currentGames.map((game) => {
        return game.id === gameId ? { ...game, myRating: rating } : game
      })
      return { ...prevState, games: updatedGames }
    })
  }

  const updateShelfState = (gameId: number | null, newShelfId: number) => {
    setListState((prevState) => {
      const currentGames = prevState.games || []

      const updatedGames = currentGames.map((game) => {
        return game.id === gameId ? { ...game, shelfId: newShelfId } : game
      })
      return { ...prevState, games: updatedGames }
    })
  }

  const isPlayedShelfSelected = () => {
    const playedShelfId = Object.keys(ShelfNames).indexOf(ShelfNames.Played) + 1
    return listState.filterShelf === playedShelfId.toString()
  }

  const handleSortChange = (field: string) => {
    const order = sortDirection[field] === 'asc' ? 'desc' : 'asc'
    if (field !== listState.sortField || order !== listState.sortOrder) {
      setSortDirection({ ...sortDirection, [field]: order })
      setListState((prevState) => ({
        ...prevState,
        sortField: field,
        sortOrder: order,
        currentPage: 1,
      }))
      setShouldFetchGames(true)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage !== listState.currentPage) {
      setListState((prevState) => ({ ...prevState, currentPage: newPage }))
      setShouldFetchGames(true)
    }
  }

  const breadcrumbItems = [{ label: 'My Games' }]

  const pagesCount = Math.ceil(gamesCount / listState.pageSize)

  const renderPagination = () => {
    let pages = []
    const halfWindow = Math.floor(MAX_DISPLAY_PAGES / 2)
    let startPage = Math.max(1, listState.currentPage - halfWindow)
    let endPage = Math.min(pagesCount, startPage + MAX_DISPLAY_PAGES - 1)

    if (listState.currentPage <= halfWindow) {
      endPage = Math.min(pagesCount, MAX_DISPLAY_PAGES)
    }
    if (listState.currentPage > pagesCount - halfWindow) {
      startPage = Math.max(1, pagesCount - MAX_DISPLAY_PAGES + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn join-item btn-sm ${
            i === listState.currentPage ? 'btn-active' : ''
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      )
    }

    if (startPage > 1) {
      pages.unshift(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      )
    }
    if (endPage < pagesCount) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      )
    }

    return pages
  }

  const showDeleteConfirmation = (gameId: number) => {
    setSelectedGameId(gameId)
    const modal: any = document.getElementById('delete-confirmation-modal')
    modal.showModal()
  }

  const confirmDelete = async () => {
    if (selectedGameId) {
      await handleDelete(selectedGameId)
      const modal: any = document.getElementById('delete-confirmation-modal')
      modal.close()
    }
  }

  const debounceFilterName = useMemo(() => {
    return debounce((value) => {
      setListState((prevState) => ({
        ...prevState,
        filterName: value,
        currentPage: 1,
      }))
      setShouldFetchGames(true)
    }, 500)
  }, [setListState])

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNameInputValue(value)
    debounceFilterName(value)
  }

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>My Games</title>
      </Head>

      <main>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-6 text-3xl font-bold">My Games</h1>
        <div className="mb-4">
          <div className="form-control">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-start md:space-x-2 md:space-y-0">
              <input
                type="text"
                value={nameInputValue}
                onChange={handleFilterName}
                className="input input-bordered w-full"
                placeholder="Filter by Name"
                data-testid="filter-name"
              />
              <select
                value={listState.filterPlatform}
                onChange={(e) => {
                  setListState({
                    filterPlatform: e.target.value,
                    currentPage: 1,
                  })
                  setShouldFetchGames(true)
                }}
                className="select select-bordered w-full"
                data-testid="filter-platform"
              >
                <option value="">Platform</option>
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={listState.filterShelf}
                onChange={(e) => {
                  setListState({ filterShelf: e.target.value, currentPage: 1 })
                  setShouldFetchGames(true)
                }}
                className="select select-bordered w-full"
                data-testid="filter-shelf"
              >
                <option value="">Shelf</option>
                {Object.entries(ShelfNames).map(([key, value], index) => (
                  <option key={key} value={index + 1}>
                    {value}
                  </option>
                ))}
              </select>
              <select
                value={listState.filterGenre}
                onChange={(e) => {
                  setListState({ filterGenre: e.target.value, currentPage: 1 })
                  setShouldFetchGames(true)
                }}
                className="select select-bordered w-full"
                data-testid="filter-genre"
              >
                <option value="">Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered w-full"
                data-testid="filter-page-size"
                value={listState.pageSize}
                onChange={(e) => {
                  setListState({
                    pageSize: parseInt(e.target.value, 10),
                    currentPage: 1,
                  })
                  setShouldFetchGames(true)
                }}
              >
                {[15, 20, 25, 30, 50, 100].map((size) => (
                  <option key={size} value={size}>{`Per page: ${size}`}</option>
                ))}
              </select>
              <button
                className="btn btn-neutral font-medium"
                data-testid="btn-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="badge" data-testid="games-count">
            Listing{' '}
            {gamesCount === 1 ? `${gamesCount} game` : `${gamesCount} games`}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="w-28 p-4">Cover</th>
                <th
                  className="w-56 cursor-pointer p-4"
                  onClick={() => handleSortChange('name')}
                >
                  Name{' '}
                  {listState.sortField === 'name'
                    ? sortDirection['name'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th
                  className="w-40 cursor-pointer p-4"
                  onClick={() => handleSortChange('platform')}
                >
                  Platform{' '}
                  {listState.sortField === 'platform'
                    ? sortDirection['platform'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th
                  className="w-36 cursor-pointer p-4"
                  onClick={() => handleSortChange('release_date')}
                >
                  Release Date{' '}
                  {listState.sortField === 'release_date'
                    ? sortDirection['release_date'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                {isPlayedShelfSelected() && (
                  <th
                    className="w-36 cursor-pointer p-4"
                    onClick={() => handleSortChange('finished_date')}
                  >
                    Finished Date{' '}
                    {listState.sortField === 'finished_date'
                      ? sortDirection['finished_date'] === 'asc'
                        ? '↑'
                        : '↓'
                      : ''}
                  </th>
                )}
                <th
                  className="w-4 cursor-pointer p-4"
                  onClick={() => handleSortChange('how_long_to_beat')}
                >
                  HLTB{' '}
                  {listState.sortField === 'how_long_to_beat'
                    ? sortDirection['how_long_to_beat'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th
                  className="w-32 cursor-pointer p-4"
                  onClick={() => handleSortChange('difficulty')}
                >
                  Difficulty{' '}
                  {listState.sortField === 'difficulty'
                    ? sortDirection['difficulty'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th
                  className="cursor-pointer p-6"
                  onClick={() => handleSortChange('my_rating')}
                >
                  My Rating{' '}
                  {listState.sortField === 'my_rating'
                    ? sortDirection['my_rating'] === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th className="w-28 p-4">Shelves</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listState.games.map((game, index) => (
                <tr
                  key={index}
                  className="border-b"
                  data-testid={`list-${index}`}
                >
                  <td className="w-28 p-4">
                    {game.coverImage && (
                      <Image
                        src={`data:image/jpeg;base64,${game.coverImage}`}
                        alt={`${game.name} cover`}
                        width={96}
                        height={96}
                        className="h-auto w-auto object-cover"
                      />
                    )}
                  </td>
                  <td className="w-60 p-4">
                    <Link
                      className="link-hover link"
                      data-testid={`name-${index}`}
                      href={`/details/${game.id}`}
                    >
                      {game.name}
                    </Link>
                  </td>
                  <td className="w-40 p-4">{game.platform}</td>
                  <td className="w-36 p-4">
                    {game.releaseDate
                      ? dayjs(game.releaseDate).format('MMM D, YYYY')
                      : ''}
                  </td>
                  {isPlayedShelfSelected() && (
                    <td className="w-36 p-4">
                      {game.finishedDate
                        ? dayjs(game.finishedDate).format('MMM D, YYYY')
                        : ''}
                    </td>
                  )}
                  <td className="w-4 p-4 text-center">{game.howLongToBeat}</td>
                  <td className="w-32 p-4">
                    {game.difficulty ? DIFFICULTY[game.difficulty] : ''}
                  </td>
                  <td className="p-4">
                    <StarRating
                      rating={game.myRating ?? 0}
                      setRating={(rating) => updateRatingState(game.id, rating)}
                      size="medium"
                      rowIndex={index}
                      gameId={game.id}
                    />
                  </td>
                  <td className="w-28 p-4">
                    <Shelves
                      gameId={game.id}
                      game={game}
                      onShelfSelect={updateShelfState}
                    />
                  </td>
                  <td className="p-4">
                    <div className="join">
                      <button
                        className="btn join-item bg-gray-500 hover:bg-gray-800"
                        data-testid={`edit-${index}`}
                        onClick={() => router.push(`/edit/${game.id}`)}
                      >
                        <FaEdit size="1.2em" alt="Edit" />
                      </button>
                      <button
                        className="btn join-item bg-rose-600 hover:bg-rose-800"
                        data-testid={`delete-${index}`}
                        onClick={() => showDeleteConfirmation(game.id)}
                      >
                        <MdDeleteForever size="1.2em" alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmationModal
            id="delete-confirmation-modal"
            title="Wait!"
            message="Are you sure you want to delete this game?"
            onConfirm={confirmDelete}
          />
        </div>
        <div className="my-4 flex justify-center">
          <div className="join">
            <button
              className="btn join-item btn-sm"
              data-testid="first-page"
              onClick={() => handlePageChange(1)}
              disabled={listState.currentPage === 1}
            >
              {'<<'}
            </button>
            <button
              className="btn join-item btn-sm"
              data-testid="previous-page"
              onClick={() => handlePageChange(listState.currentPage - 1)}
              disabled={listState.currentPage === 1}
            >
              {'<'}
            </button>
            {renderPagination()}
            <button
              className="btn join-item btn-sm"
              data-testid="next-page"
              onClick={() => handlePageChange(listState.currentPage + 1)}
              disabled={listState.currentPage === pagesCount}
            >
              {'>'}
            </button>
            <button
              className="btn join-item btn-sm"
              data-testid="last-page"
              onClick={() => handlePageChange(pagesCount)}
              disabled={listState.currentPage === pagesCount}
            >
              {'>>'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${baseUrl}/api/list`)
  const data = await res.json()

  const games = data.games
  const genres = data.genres

  return { props: { games, genres } }
}

export default List
