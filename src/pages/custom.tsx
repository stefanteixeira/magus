import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import StarRating from '@/components/StarRating'
import DatePicker from '@/components/DatePicker'
import Breadcrumbs from '@/components/Breadcrumbs'
import dayjs from 'dayjs'
import Shelves from '@/components/Shelves'
import { PLATFORM_OPTIONS } from '@/constants/platforms'

const CustomGame: React.FC = () => {
  const [coverUrl, setCoverUrl] = useState('')
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [finishedDate, setFinishedDate] = useState('')
  const [myRating, setMyRating] = useState<number>(0)
  const [summary, setSummary] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    if (!coverUrl) {
      setErrorMessage('Please set a cover URL.')
      return
    }

    const newGame = {
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
      shelfId: selectedShelf,
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

    router.push('/list')
  }

  const handleCancel = () => {
    router.push('/')
  }

  const handleShelfSelect = (gameId: number | null, shelfId: number) => {
    setSelectedShelf(shelfId)
  }

  const breadcrumbItems = [{ label: 'Add from scratch' }]

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>Add Custom Game</title>
      </Head>
      <main className="flex flex-col items-center justify-center">
        <div className="max-w-8xl self-start">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <h1 className="mb-4 text-center text-3xl font-bold">Add Custom Game</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
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
              onChange={(e) => {
                setCoverUrl(e.target.value)
                setErrorMessage('')
              }}
            />
          </div>
          <div>
            <div className="label">
              <span className="label-text">Platform</span>
            </div>
            <select
              className="input input-bordered w-full"
              id="platform"
              data-testid="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Select a Platform</option>
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              <span className="label-text">Release Date</span>
            </div>
            <DatePicker
              placeholder="Release Date"
              value={releaseDate}
              onChange={setReleaseDate}
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
              data-testid="btn-cancel"
              onClick={handleCancel}
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

export default CustomGame
