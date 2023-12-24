import * as schema from '@/db/schema'
import { db } from '@/db/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end('Method Not Allowed')
    return
  }

  const { gameId } = req.body

  try {
    await db
      .update(schema.myGames)
      .set({ shelfId: null })
      .where(sql`id = ${gameId}`)

    res.status(200).json({ message: 'Game successfully removed from shelf' })
  } catch (error) {
    res.status(500).json({ message: 'Error removing game from shelf', error })
  }
}
