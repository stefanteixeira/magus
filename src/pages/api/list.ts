import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db/db'
import { sql } from 'drizzle-orm'
import { MyGame } from '@/types/types'
import { DEFAULT_PAGE_SIZE } from '../list'

type GenreResult = { genre: string }
type FinishedYearResult = { finishedYear: string }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end('Method Not Allowed')
    return
  }

  const {
    sortField,
    sortOrder,
    filterPlatform,
    filterShelf,
    filterGenre,
    filterName,
    finishedYear,
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
  } = req.query
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string)

  try {
    let whereConditions = []

    if (filterPlatform) {
      whereConditions.push(sql`platform = ${filterPlatform}`)
    }

    if (filterShelf) {
      const shelfId = Number(filterShelf)

      // If we are filtering by Backlog, include also games in Priority shelf
      if (shelfId === 4) {
        whereConditions.push(sql`(shelf_id = 4 OR shelf_id = 5)`)
      } else {
        whereConditions.push(sql`shelf_id = ${shelfId}`)
      }
    }

    if (filterGenre) {
      whereConditions.push(sql`genre LIKE ${'%' + filterGenre + '%'}`)
    }

    if (filterName) {
      whereConditions.push(sql`name LIKE ${'%' + filterName + '%'}`)
    }

    if (finishedYear) {
      whereConditions.push(sql`strftime('%Y', finished_date) = ${finishedYear}`)
    }

    let countQuery = sql`SELECT COUNT(*) as gamesCount FROM my_games`
    if (whereConditions.length > 0) {
      countQuery
        .append(sql` WHERE `)
        .append(sql.join(whereConditions, sql` AND `))
    }
    const countResult: any = await db.get(countQuery)
    const gamesCount = countResult.gamesCount

    let gamesQuery = sql`SELECT * from my_games`
    if (whereConditions.length > 0) {
      gamesQuery
        .append(sql` WHERE `)
        .append(sql.join(whereConditions, sql` AND `))
    }

    if (sortField && sortOrder) {
      gamesQuery.append(
        sql` ORDER BY ${sql.raw(sortField.toString())} ${sql.raw(
          sortOrder.toString()
        )}`
      )
    }

    gamesQuery.append(sql` LIMIT ${parseInt(limit as string)} OFFSET ${offset}`)

    const games: MyGame[] = await db.all(gamesQuery)

    const gamesWithBase64Images = games.map((game: any) => {
      return {
        id: game.id,
        igdbId: game.igdb_id,
        coverUrl: game.cover_url,
        coverImage: game.cover_image
          ? (game.cover_image as Buffer).toString('base64')
          : null,
        myRating: game.my_rating,
        name: game.name,
        platform: game.platform,
        genre: game.genre,
        releaseDate: game.release_date,
        finishedDate: game.finished_date,
        summary: game.summary,
        howLongToBeat: game.how_long_to_beat,
        shelfId: game.shelf_id,
        difficulty: game.difficulty,
      }
    })

    // Fetch all unique Genres from the DB to populate list page filter options
    const genresQuery = sql`SELECT genre FROM my_games WHERE genre IS NOT NULL`
    const genresResult: GenreResult[] = await db.all(genresQuery)

    const allGenres = genresResult
      .map((genresResult) => genresResult.genre.split(', '))
      .flat()
      .filter((genre) => genre.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()

    // Fetch all unique years from Finished Date values in the DB to populate stats page filter options
    const yearsQuery = sql`
      SELECT DISTINCT strftime('%Y', finished_date) as finishedYear
      FROM my_games
      WHERE finished_date IS NOT NULL
      ORDER BY finishedYear DESC
    `
    const finishedYearsResult: FinishedYearResult[] = await db.all(yearsQuery)
    const allFinishedYears = finishedYearsResult.map(
      (result) => result.finishedYear
    )

    res.status(200).json({
      games: gamesWithBase64Images,
      gamesCount,
      genres: allGenres,
      finishedYears: allFinishedYears,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve games', error })
  }
}

export default handler
