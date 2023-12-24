import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { sql } from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end('Method Not Allowed')
    return
  }

  const { id } = req.query

  if (!id) {
    res.status(400).json({ message: 'Game ID is required' })
    return
  }

  try {
    await db.delete(schema.myGames).where(sql`id = ${id}`)

    res.status(200).json({ message: 'Game deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
