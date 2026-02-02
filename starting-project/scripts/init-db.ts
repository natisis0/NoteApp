// Database initialization script
// Run with: npm run db:init

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get database path from environment or use default
const dbPath = process.env.DB_PATH || 'data/app.db';
const fullPath = path.resolve(process.cwd(), dbPath);

// Ensure the data directory exists
const dir = path.dirname(fullPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Create database connection
const db = new Database(fullPath);
db.pragma('journal_mode = WAL');

// SQL statements for initializing the database
const initStatements = [
  // better-auth: user table
  `CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  // better-auth: session table
  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiresAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES user(id)
  )`,

  // better-auth: account table
  `CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES user(id)
  )`,

  // better-auth: verification table
  `CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  // Application: notes table
  `CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    is_public INTEGER NOT NULL DEFAULT 0,
    public_slug TEXT UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`,

  // Indexes for notes table
  `CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notes_public_slug ON notes(public_slug)`,
  `CREATE INDEX IF NOT EXISTS idx_notes_is_public ON notes(is_public)`,
];

console.log(`Initializing database at: ${fullPath}`);

for (const sql of initStatements) {
  db.exec(sql);
}

db.close();
console.log('Database initialized successfully!');
