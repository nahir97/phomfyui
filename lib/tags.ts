import Database from 'better-sqlite3';
import path from 'path';

// Singleton connection to avoid multiple connections in development
let db: Database.Database | undefined;

function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'tags', 'tags.db');
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

export interface Tag {
  name: string;
  tag_type: string;
  post_count: number;
}

export function searchTags(query: string, limit: number = 20): Tag[] {
  if (!query || query.length < 2) return [];

  try {
    const database = getDb();
    // Prefix search with LIKE
    const stmt = database.prepare(`
      SELECT name, tag_type, post_count 
      FROM tags 
      WHERE name LIKE ? 
      ORDER BY post_count DESC 
      LIMIT ?
    `);

    // Standard autocompletion behavior (starts with)
    return stmt.all(`${query}%`, limit) as Tag[];
  } catch (error) {
    console.error('Error querying tags database:', error);
    return [];
  }
}
