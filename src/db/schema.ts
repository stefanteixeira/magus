import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'

export const myGames = sqliteTable('my_games', {
  id: integer('id').primaryKey(),
  igdbId: integer('igdb_id'),
  coverUrl: text('cover_url'),
  coverImage: blob('cover_image'),
  myRating: integer('my_rating'),
  name: text('name').notNull(),
  platform: text('platform').notNull(),
  genre: text('genre'),
  releaseDate: text('release_date'),
  finishedDate: text('finished_date'),
  summary: text('summary'),
  howLongToBeat: integer('how_long_to_beat'),
  shelfId: integer('shelf_id').references(() => shelves.id),
  difficulty: integer('difficulty'),
})

export const shelves = sqliteTable('shelves', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
})
