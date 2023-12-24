import type { NextApiRequest, NextApiResponse } from 'next'
import igdb from 'igdb-api-node'
import { GameData, GameWithCover } from '@/types/types'
import PQueue from 'p-queue'
import { getToken } from '@/utils/token-manager'
import { debug } from '@/utils/debug'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    const { gameName, platform } = req.body
    const accessToken = await getToken()
    const client = igdb(process.env.CLIENT_ID, accessToken)

    const searchQuery = await client
      .search(gameName)
      .fields(
        'name,platforms.name,first_release_date,cover,genres.name,summary'
      )
      .limit(15)

    if (platform) {
      searchQuery.where(`platforms.name = "${platform}"`)
    }

    const gamesResponse = await searchQuery.request('/games')
    const games: GameData[] = gamesResponse.data

    debug('IGDB search response:\n', games)

    const queue = new PQueue({ interval: 1000, intervalCap: 4 })

    const coverPromises = games.map((game) =>
      queue.add(async () => {
        if (!game.cover) return null
        const coverResponse = await client
          .fields('game,url')
          .where(`id = ${game.cover}`)
          .request('/covers')
        return coverResponse.data[0] || { game: game.id, url: null }
      })
    )

    const covers = await Promise.all(coverPromises)

    const gamesWithCovers: GameWithCover[] = games.map((game) => {
      const coverData = covers.find((cover) => cover && cover.game === game.id)
      return {
        ...game,
        coverUrl: coverData
          ? `https:${coverData.url.replace('t_thumb', 't_cover_big')}`
          : null,
      }
    })

    res.status(200).json(gamesWithCovers)
  } catch (error) {
    console.error('Error fetching IGDB API:', error)
    res.status(500).json({ message: 'Error fetching IGDB API', error })
  }
}

export default handler
