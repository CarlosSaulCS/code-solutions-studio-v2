// Test Neon connection
const { Client } = require('pg')

const connectionString = process.env.DATABASE_URL

async function testConnection() {
  console.log('🔗 Testing Neon PostgreSQL connection...')
  console.log('Connection string (masked):', connectionString?.replace(/:[^@]+@/, ':***@'))
  
  try {
    const client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    })
    
    await client.connect()
    console.log('✅ Connected to Neon PostgreSQL successfully!')
    
    const result = await client.query('SELECT version()')
    console.log('📊 PostgreSQL version:', result.rows[0].version)
    
    await client.end()
    console.log('✅ Connection test completed!')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  }
}

testConnection()
