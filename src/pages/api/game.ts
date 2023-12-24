import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { sql } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id) {
    res.status(400).json({ message: 'Game ID is required' })
    return
  }

  try {
    const game = await db
      .select()
      .from(schema.myGames)
      .where(sql`id = ${id}`)

    if (game.length === 0) {
      res.status(404).json({ message: 'Game not found' })
      return
    }

    if (game[0].coverImage && Buffer.isBuffer(game[0].coverImage)) {
      game[0].coverImage = Buffer.from(game[0].coverImage).toString('base64')
    }

    res.status(200).json(game[0])
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
