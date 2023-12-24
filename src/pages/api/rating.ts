import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { sql } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const { id, rating } = req.body

      await db
        .update(schema.myGames)
        .set({ myRating: rating })
        .where(sql`id = ${id}`)

      res.status(200).json({ message: 'Rating updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end('Method Not Allowed')
  }
}
