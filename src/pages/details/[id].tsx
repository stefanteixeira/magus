import Breadcrumbs from '@/components/Breadcrumbs'
import Shelves from '@/components/Shelves'
import StarRating from '@/components/StarRating'
import { DIFFICULTY } from '@/constants/difficulty'
import { MyGame } from '@/types/types'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react'

interface GameDetailsProps {
  game: MyGame
}

const GameDetails: React.FC<GameDetailsProps> = ({ game }) => {
  const [myGame, setGame] = useState<MyGame>(game)

  const updateRatingState = (gameId: number, rating: number) => {
    const updatedGame = (game: MyGame) => {
      if (game.id === gameId) {
        return { ...game, myRating: rating }
      }
      return game
    }

    setGame(updatedGame)
  }

  const breadcrumbItems = [
    { label: 'My Games', href: '/list' },
    { label: 'Game Details' },
  ]

  return (
    <div className="max-w-8xl container mx-auto px-4 py-8">
      <Head>
        <title>Game Details</title>
      </Head>

      <main>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-wrap md:flex-nowrap">
          <div className="flex w-full items-center md:w-auto md:max-w-xs">
            {myGame.coverImage && (
              <Image
                src={`data:image/jpeg;base64,${myGame.coverImage}`}
                alt={`${myGame.name} cover`}
                style={{
                  objectFit: 'cover',
                }}
                width={200}
                height={200}
                className="relative pb-4 pr-4"
              />
            )}
          </div>
          <div className="w-full md:flex-1 md:pl-4">
            <h1 className="pb-4 text-3xl font-bold">{myGame.name}</h1>
            <p className="pb-2 text-sm">
              <b>Genre:</b> {myGame.genre}
            </p>
            <p className="pb-2 text-sm">
              <b>Platform:</b> {myGame.platform}
            </p>
            {myGame.releaseDate && (
              <p className="pb-2 text-sm">
                <b>Release Date:</b>{' '}
                {dayjs(myGame.releaseDate).format('MMM D, YYYY')}
              </p>
            )}
            {myGame.finishedDate && (
              <p className="pb-2 text-sm">
                <b>Finished Date:</b>{' '}
                {dayjs(myGame.finishedDate).format('MMM D, YYYY')}
              </p>
            )}
            {myGame.howLongToBeat && (
              <p className="pb-2 text-sm" data-testid="hltb">
                <b>How long to beat:</b> {myGame.howLongToBeat}{' '}
                {myGame.howLongToBeat === 1 ? 'hour' : 'hours'}
              </p>
            )}
            {myGame.difficulty && (
              <p className="pb-2 text-sm" data-testid="difficulty">
                <b>Difficulty:</b> {DIFFICULTY[myGame.difficulty]}
              </p>
            )}
            <div className="flex items-center pb-4">
              <p className="flex-none pr-2 text-sm">
                <b className="mb-6">My Rating:</b>
              </p>
              <StarRating
                rating={myGame.myRating ?? 0}
                setRating={(rating) => updateRatingState(game.id, rating)}
                size="medium"
                gameId={game.id}
              />
            </div>
            <Shelves gameId={myGame.id} />
            <div className="prose max-w-none pt-4">
              <p className="text-sm">{myGame.summary}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const response = await fetch(`${baseUrl}/api/game?id=${context.query.id}`)
  const game = await response.json()

  return { props: { game } }
}

export default GameDetails
