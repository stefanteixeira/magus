import Breadcrumbs from '@/components/Breadcrumbs'
import { useStats } from '@/contexts/StatsContext'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface StatsProps {
  finishedYears: string[]
}

const Stats: React.FC<StatsProps> = ({ finishedYears }) => {
  const {
    year,
    setYear,
    games,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    fetchGames,
  } = useStats()

  useEffect(() => {
    fetchGames()
  }, [year, fetchGames])

  const breadcrumbItems = [{ label: 'Stats' }]

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>Stats</title>
      </Head>

      <main>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-6 text-3xl font-bold">Stats</h1>
        <div className="mb-4">
          <div className="form-control">
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-center md:justify-start md:space-x-2 md:space-y-0">
              <div className="label">
                <span className="label-text-lg">Sort by:</span>
              </div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="select select-bordered max-w-xs"
                data-testid="filter-year"
              >
                <option value="">Year</option>
                {finishedYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="select select-bordered max-w-xs"
                data-testid="sort-field"
              >
                <option value="finished_date">Finished Date</option>
                <option value="name">Name</option>
                <option value="my_rating">My Rating</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="select select-bordered max-w-xs"
                data-testid="sort-order"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center">
          {games.map((game) => (
            <div
              key={game.id}
              className="md:w-auto md:max-w-xs"
              data-testid="game-cover"
            >
              {game.coverImage && (
                <div className="lg:tooltip" data-tip={game.name}>
                  <Link href={`/details/${game.id}`} passHref>
                    <Image
                      src={`data:image/jpeg;base64,${game.coverImage}`}
                      alt={`${game.name} cover`}
                      width={150}
                      height={150}
                      style={{
                        objectFit: 'cover',
                      }}
                      className="relative pb-4 pr-4"
                    />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${baseUrl}/api/list`)
  const data = await res.json()

  const { finishedYears } = data

  return { props: { games: [], finishedYears } }
}

export default Stats
