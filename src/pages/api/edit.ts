import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { sql } from 'drizzle-orm'
import { fetchImageAsBlob } from '@/utils/fetch-image-as-blob'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end('Method Not Allowed')
    return
  }

  const { id } = req.query
  const { coverUrl, ...rest } = req.body

  if (!id) {
    res.status(400).json({ message: 'Game ID is required' })
    return
  }

  try {
    const coverImageBlob = await fetchImageAsBlob(coverUrl)

    await db
      .update(schema.myGames)
      .set({
        ...rest,
        coverImage: coverImageBlob,
      })
      .where(sql`id = ${id}`)

    res.status(200).json({ message: 'Game updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}
