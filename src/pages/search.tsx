import Breadcrumbs from '@/components/Breadcrumbs'
import { PLATFORM_OPTIONS } from '@/constants/platforms'
import { useSearch } from '@/contexts/SearchContext'
import { Game } from '@/types/types'
import { formatDate } from '@/utils/format-date'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Search: React.FC = () => {
  const [lastQuery, setLastQuery] = useState({ gameName: '', platform: '' })
  const {
    searchResultsState,
    setSearchResultsState,
    gameName,
    setGameName,
    platform,
    setPlatform,
  } = useSearch()
  const [searchResults, setSearchResults] = useState<Game[]>(searchResultsState)
  const [isLoading, setIsLoading] = useState(false)
  const [searchAttempted, setSearchAttempted] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setSearchResults(searchResultsState)
  }, [searchResultsState])

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSearchAttempted(true)

    const query = {
      gameName,
      platform: platform || '',
    }

    if (
      query.gameName === lastQuery.gameName &&
      query.platform === lastQuery.platform &&
      searchResultsState.length > 0
    ) {
      setSearchResults(searchResultsState)
      setIsLoading(false)
      return
    }

    setLastQuery(query)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      })
      if (response.ok) {
        const data = (await response.json()) as Game[]
        setSearchResults(data)
        setSearchResultsState(data)
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const breadcrumbItems = [{ label: 'Search' }]

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>Search</title>
      </Head>

      <main>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-6 text-3xl font-bold">Search</h1>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={gameName}
            onChange={(e) => {
              setGameName(e.target.value)
              setSearchAttempted(false)
            }}
            className="input input-bordered mb-2 mr-2 w-full max-w-xs"
            placeholder="Name"
            data-testid="name"
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="select select-bordered mb-2 mr-2 w-full max-w-xs"
            data-testid="platform"
          >
            <option value="">Select a Platform</option>
            {PLATFORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn btn-primary font-medium"
            disabled={isLoading}
            data-testid="search"
          >
            Search
          </button>
        </form>

        <div className="overflow-x-auto">
          {searchResults.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Platforms</th>
                  <th className="p-4">Genres</th>
                  <th className="p-4">Release Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((game, index) => (
                  <tr
                    key={index}
                    className="border-b"
                    data-testid={`search-result-${index}`}
                  >
                    <td className="p-4">
                      {game.coverUrl && (
                        <Image
                          src={game.coverUrl}
                          alt={`${game.name} cover`}
                          width={96}
                          height={96}
                          className="h-auto w-24 object-cover"
                        />
                      )}
                    </td>
                    <td className="p-4">{game.name}</td>
                    <td className="p-4">
                      {game.platforms
                        ?.map((platform) => platform.name)
                        .join(', ')}
                    </td>
                    <td className="p-4">
                      {game.genres?.map((genre) => genre.name).join(', ')}
                    </td>
                    <td className="p-4">
                      {game.first_release_date
                        ? formatDate(game.first_release_date)
                        : 'Unknown'}
                    </td>
                    <td className="p-4">
                      <button
                        className="btn btn-secondary w-40 font-medium"
                        data-testid={`add-game-${index}`}
                        onClick={() =>
                          router.push({
                            pathname: '/new',
                            query: {
                              igdbId: game.id,
                              name: game.name,
                              coverUrl: game.coverUrl,
                              platform: game.platforms
                                ? game.platforms.map((p) => p.name).join(', ')
                                : '',
                              genre: game.genres
                                ? game.genres.map((p) => p.name).join(', ')
                                : '',
                              releaseDate: game.first_release_date
                                ? formatDate(game.first_release_date)
                                : 'Unknown',
                              summary: game.summary,
                            },
                          })
                        }
                      >
                        Add to My Games
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : isLoading ? (
            <div role="alert" className="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-info"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Searching...</span>
            </div>
          ) : searchAttempted ? (
            <div
              role="alert"
              className="alert alert-info"
              data-testid="info-alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>No games found. Please try another search query.</span>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default Search
