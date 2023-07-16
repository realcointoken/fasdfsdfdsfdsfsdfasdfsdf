import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env

export const db = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: Number(PGPORT),
})

export const dbTest = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'biliratest',
  password: 'admin',
  port: 5432,
})
