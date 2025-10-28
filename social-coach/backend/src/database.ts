import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = process.env.DATABASE_PATH || './database/social-coach.db';

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Promisify database methods
export const dbRun = promisify(db.run.bind(db));
export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

// Initialize database with migrations
export async function initializeDatabase(): Promise<void> {
  try {
    const migrationPath = path.join(__dirname, '../database/migrations/001_init.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and run each statement
    const statements = migration.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await dbRun(statement);
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export default db;
