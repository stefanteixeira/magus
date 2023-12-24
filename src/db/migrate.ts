import * as schema from '@/db/schema'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { ShelfNames } from '@/types/types'
import { sql } from 'drizzle-orm'

async function runMigration() {
  const sqlite = new Database(process.env.SQLITE_DB_FILENAME || 'sqlite.db')
  const db = drizzle(sqlite)
  await migrate(db, { migrationsFolder: './drizzle' })

  for (const shelf of Object.values(ShelfNames)) {
    const existingShelf = await db
      .select()
      .from(schema.shelves)
      .where(sql`name = ${shelf}`)

    if (existingShelf.length === 0) {
      await db.insert(schema.shelves).values({ name: shelf })
    }
  }
}

runMigration().catch((error) => {
  console.error('Migration failed: ', error)
})
