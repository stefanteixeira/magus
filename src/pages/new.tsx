import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StarRating from '@/components/StarRating'
import DatePicker from '@/components/DatePicker'
import fetchHltbData from '@/utils/fetch-hltb'
import fetchGameDifficulty from '@/utils/fetch-difficulty'
import Breadcrumbs from '@/components/Breadcrumbs'
import dayjs from 'dayjs'
import Shelves from '@/components/Shelves'
import { DIFFICULTY } from '@/constants/difficulty'

const NewGame: React.FC = () => {
  const [igdbId, setIgdbId] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [name, setName] = useState('')
  const [platformOptions, setPlatformOptions] = useState<string[]>([])
  const [platform, setPlatform] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [finishedDate, setFinishedDate] = useState('')
  const [myRating, setMyRating] = useState<number>(0)
  const [summary, setSummary] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hltbData, setHltbData] = useState('')
  const [hltbError, setHltbError] = useState('')
  const [gameDifficulty, setGameDifficulty] = useState<number | null>(null)
  const [gameDifficultyError, setGameDifficultyError] = useState('')
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (router.query) {
      setIgdbId(router.query.igdbId as string)
      setName(router.query.name as string)
      setCoverUrl(router.query.coverUrl as string)
      setPlatformOptions((router.query.platform as string).split(','))
      setGenre(router.query.genre as string)
      setReleaseDate(router.query.releaseDate as string)
      setSummary(router.query.summary as string)
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    if (!platform) {
      setErrorMessage('Please select a Platform.')
      return
    }

    const newGame = {
      igdbId,
      coverUrl,
      myRating: myRating > 0 ? myRating : null,
      name,
      platform,
      genre,
      releaseDate: releaseDate ? dayjs(releaseDate).format('YYYY-MM-DD') : null,
      finishedDate: finishedDate
        ? dayjs(finishedDate).format('YYYY-MM-DD')
        : null,
      summary,
      howLongToBeat: hltbData === '' ? null : hltbData,
      shelfId: selectedShelf,
      difficulty: gameDifficulty ? Number(gameDifficulty) : null,
    }

    const response = await fetch('/api/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGame),
    })

    if (!response.ok) {
      if (response.status === 409) {
        const data = await response.json()
        setErrorMessage(data.message)
        return
      }
    }

    router.push('/search')
  }

  const handleCancel = () => {
    router.push('/search')
  }

  const handleShelfSelect = (gameId: number | null, shelfId: number) => {
    setSelectedShelf(shelfId)
  }

  const breadcrumbItems = [
    { label: 'Search', href: '/search' },
    { label: 'Add Game' },
  ]

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>Add Game</title>
      </Head>
      <main className="flex flex-col items-center justify-center">
        <div className="max-w-8xl self-start">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <h1 className="mb-4 text-center text-3xl font-bold">Add Game</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
          <div>
            <div className="label">
              <span className="label-text">IGDB Id</span>
            </div>
            <input
              type="text"
              placeholder="IGDB Id"
              className="input input-bordered w-full"
              id="igdbId"
              data-testid="igdb-id"
              value={igdbId}
              onChange={(e) => setIgdbId(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              id="name"
              data-testid="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Cover URL</span>
            </div>
            <input
              type="url"
              placeholder="Cover URL"
              className="input input-bordered w-full"
              id="coverUrl"
              data-testid="cover-url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Platform</span>
            </div>
            <div className="mt-2">
              {platformOptions.map((platformOption, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2"
                  data-testid="platform"
                >
                  <input
                    type="radio"
                    id={`platform_${index}`}
                    data-testid={`platform_${index}`}
                    name="platform"
                    value={platformOption.trim()}
                    className="radio radio-sm checked:radio-secondary"
                    onChange={(e) => {
                      setPlatform(e.target.value)
                      setErrorMessage('')
                    }}
                    checked={platform === platformOption.trim()}
                  />
                  <label
                    htmlFor={`platform_${index}`}
                    className="label cursor-pointer"
                  >
                    <span className="label-text">{platformOption}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="label">
              <span className="label-text">Genre</span>
            </div>
            <input
              type="text"
              placeholder="Genre"
              className="input input-bordered w-full"
              id="genre"
              data-testid="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Released Date</span>
            </div>
            <DatePicker
              placeholder="Release Date"
              value={releaseDate}
              onChange={setReleaseDate}
              allowClear={false}
              testId="release-date"
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Finished Date</span>
            </div>
            <DatePicker
              placeholder="Finished Date"
              value={finishedDate}
              onChange={setFinishedDate}
              testId="finished-date"
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">My Rating</span>
            </div>
            <StarRating rating={myRating} setRating={setMyRating} />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Shelf</span>
            </div>
            <Shelves onShelfSelect={handleShelfSelect} />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Summary</span>
            </div>
            <textarea
              placeholder="Summary"
              className="textarea textarea-bordered textarea-md w-full"
              id="summary"
              data-testid="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">How Long to Beat</span>
            </div>
            <div className="mt-1 flex">
              <input
                type="number"
                id="hltb"
                data-testid="hltb"
                placeholder="How long to beat (in hours)"
                className="input input-bordered w-full"
                value={hltbData || ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (
                    value === '' ||
                    (!isNaN(parseFloat(value)) && value.trim() !== '')
                  ) {
                    setHltbData(value)
                    setHltbError('')
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-accent ml-2"
                onClick={() =>
                  fetchHltbData(name, platform, setHltbData, setHltbError)
                }
                data-testid="btn-fetch"
              >
                Fetch
              </button>
            </div>
            {hltbError && (
              <div role="alert" className="alert alert-warning mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <label>{hltbError}</label>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="label">
              <span className="label-text">Game Difficulty</span>
            </div>
            <div className="mt-1 flex">
              <select
                id="game-difficulty"
                data-testid="game-difficulty"
                className="select select-bordered w-full"
                value={gameDifficulty || ''}
                onChange={(e) => setGameDifficulty(Number(e.target.value))}
              >
                <option value="">Select Difficulty</option>
                {Object.entries(DIFFICULTY).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-accent ml-2"
                onClick={() => {
                  if (!platform) {
                    setGameDifficultyError('Please select a Platform.')
                    setTimeout(() => setGameDifficultyError(''), 3000)
                  } else {
                    fetchGameDifficulty(
                      name,
                      platform,
                      setGameDifficulty,
                      setGameDifficultyError
                    )
                  }
                }}
                data-testid="btn-fetch-game-difficulty"
              >
                Fetch
              </button>
            </div>
            {gameDifficultyError && (
              <div role="alert" className="alert alert-warning mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <label>{gameDifficultyError}</label>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn btn-primary w-28 font-medium"
              data-testid="btn-add"
            >
              Add Game
            </button>
            <button
              type="button"
              className="btn btn-neutral w-28 font-medium"
              onClick={handleCancel}
              data-testid="btn-cancel"
            >
              Cancel
            </button>
          </div>
          {errorMessage && (
            <div role="alert" className="alert alert-error text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}

export default NewGame
