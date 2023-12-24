import * as schema from '@/db/schema'
import { db } from '@/db/db'
import type { NextApiResponse } from 'next'

export default async function handler(res: NextApiResponse) {
  try {
    const shelves = await db.select().from(schema.shelves)
    res.status(200).json(shelves)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
