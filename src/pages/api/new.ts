import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { sql } from 'drizzle-orm'
import { debug } from '@/utils/debug'
import { fetchImageAsBlob } from '@/utils/fetch-image-as-blob'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    const { igdbId } = req.body

    debug('/new request body:\n', req.body)

    if (igdbId) {
      const existingGame = await db
        .select()
        .from(schema.myGames)
        .where(sql`igdb_id = ${igdbId}`)

      if (existingGame.length > 0) {
        res.status(409).json({ message: 'Game is already in your list.' })
        return
      }
    } else {
      req.body.igdbId = null
    }

    const coverImageBlob = await fetchImageAsBlob(req.body.coverUrl)

    await db.insert(schema.myGames).values({
      ...req.body,
      coverImage: coverImageBlob,
    })

    res.status(201).json({ message: 'Game added successfully' })
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

export default handler
