import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database singleton
let db: Database.Database | null = null;

/**
 * Get the SQLite database connection (singleton)
 */
export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = process.env.DB_PATH || 'data/app.db';
  const fullPath = path.resolve(process.cwd(), dbPath);

  // Ensure the data directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(fullPath);
  db.pragma('journal_mode = WAL');

  return db;
}

/**
 * Execute a query and return all rows
 */
export function query<T>(sql: string, params?: unknown[]): T[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  return (params ? stmt.all(...params) : stmt.all()) as T[];
}

/**
 * Execute a query and return the first row
 */
export function get<T>(sql: string, params?: unknown[]): T | undefined {
  const database = getDb();
  const stmt = database.prepare(sql);
  return (params ? stmt.get(...params) : stmt.get()) as T | undefined;
}

/**
 * Execute a query without returning data (INSERT, UPDATE, DELETE)
 */
export function run(sql: string, params?: unknown[]): Database.RunResult {
  const database = getDb();
  const stmt = database.prepare(sql);
  return params ? stmt.run(...params) : stmt.run();
}

/**
 * Close the database connection
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
