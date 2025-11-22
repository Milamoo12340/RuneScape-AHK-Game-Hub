import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('DATABASE_URL not set. Skipping database setup.');
  process.exit(0);
}

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    const sql = neon(databaseUrl);

    // Create tables
    console.log('Creating tables...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Users table');

    await sql`
      CREATE TABLE IF NOT EXISTS scripts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        code TEXT NOT NULL,
        author TEXT DEFAULT 'User',
        user_id VARCHAR REFERENCES users(id),
        is_public BOOLEAN DEFAULT true,
        is_favorite INTEGER DEFAULT 0,
        execution_count INTEGER DEFAULT 0,
        last_executed TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Scripts table');

    await sql`
      CREATE TABLE IF NOT EXISTS news_articles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT NOT NULL,
        image_url TEXT,
        source TEXT NOT NULL,
        category TEXT NOT NULL,
        published_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ News articles table');

    await sql`
      CREATE TABLE IF NOT EXISTS system_stats (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        cpu_usage INTEGER NOT NULL,
        gpu_usage INTEGER NOT NULL,
        ram_usage INTEGER NOT NULL,
        fps INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ System stats table');

    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS IDX_user_sessions_expire on user_sessions (expire)`;
    console.log('✓ User sessions table');

    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupDatabase();
