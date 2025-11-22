import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  const client = await pool.connect();
  try {
    console.log('🔄 Creating tables...');
    
    await client.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(50) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ users');
    
    await client.query(`CREATE TABLE IF NOT EXISTS scripts (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, code TEXT NOT NULL, author TEXT DEFAULT 'User', user_id VARCHAR REFERENCES users(id), is_public BOOLEAN DEFAULT true, is_favorite INTEGER DEFAULT 0, execution_count INTEGER DEFAULT 0, last_executed TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ scripts');
    
    await client.query(`CREATE TABLE IF NOT EXISTS news_articles (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, content TEXT NOT NULL, summary TEXT NOT NULL, image_url TEXT, source TEXT NOT NULL, category TEXT NOT NULL, published_at TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ news_articles');
    
    await client.query(`CREATE TABLE IF NOT EXISTS system_stats (id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(), cpu_usage INTEGER NOT NULL, gpu_usage INTEGER NOT NULL, ram_usage INTEGER NOT NULL, fps INTEGER NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    console.log('✓ system_stats');
    
    await client.query(`CREATE TABLE IF NOT EXISTS user_sessions (sid VARCHAR PRIMARY KEY, sess JSONB NOT NULL, expire TIMESTAMP NOT NULL)`);
    console.log('✓ user_sessions');
    
    await client.query(`CREATE INDEX IF NOT EXISTS IDX_user_sessions_expire on user_sessions (expire)`);
    console.log('✓ index');
    
    console.log('✅ ALL TABLES CREATED!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();
