import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '@/db/schema'

const sqlite = new Database(process.env.SQLITE_DB_FILENAME || 'sqlite.db')
export const db = drizzle(sqlite, { schema })
