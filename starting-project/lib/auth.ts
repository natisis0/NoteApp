import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure database directory exists
const dbPath = process.env.DB_PATH || 'data/app.db';
const fullPath = path.resolve(process.cwd(), dbPath);
const dir = path.dirname(fullPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const database = new Database(fullPath);

export const auth = betterAuth({
  // Pass the database instance directly (better-auth auto-detects SQLite)
  database: database,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
