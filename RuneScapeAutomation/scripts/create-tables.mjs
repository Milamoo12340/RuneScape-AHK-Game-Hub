import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(url);

async function createTables() {
  try {
    console.log('Creating tables...');
    
    const results = await Promise.all([
      sql`CREATE TABLE IF NOT EXISTS users (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      sql`CREATE TABLE IF NOT EXISTS scripts (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, code TEXT NOT NULL, author TEXT DEFAULT 'User', user_id VARCHAR REFERENCES users(id), is_public BOOLEAN DEFAULT true, is_favorite INTEGER DEFAULT 0, execution_count INTEGER DEFAULT 0, last_executed TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      sql`CREATE TABLE IF NOT EXISTS news_articles (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, content TEXT NOT NULL, summary TEXT NOT NULL, image_url TEXT, source TEXT NOT NULL, category TEXT NOT NULL, published_at TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      sql`CREATE TABLE IF NOT EXISTS system_stats (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), cpu_usage INTEGER NOT NULL, gpu_usage INTEGER NOT NULL, ram_usage INTEGER NOT NULL, fps INTEGER NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      sql`CREATE TABLE IF NOT EXISTS user_sessions (sid VARCHAR PRIMARY KEY, sess JSONB NOT NULL, expire TIMESTAMP NOT NULL)`,
    ]);
    
    console.log('✅ All tables created!');
    console.log('✓ users table');
    console.log('✓ scripts table');
    console.log('✓ news_articles table');
    console.log('✓ system_stats table');
    console.log('✓ user_sessions table');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTables();
