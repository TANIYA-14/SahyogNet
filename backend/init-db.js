import fs from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runSetup() {
  try {
    console.log(`Connecting to database at ${process.env.DATABASE_URL}...`);
    const sql = fs.readFileSync(new URL('./setup.sql', import.meta.url), 'utf8');
    await pool.query(sql);
    console.log("✅ Database schema created and data seeded successfully!");
  } catch (err) {
    console.error("❌ Error setting up DB:", err.message);
  } finally {
    pool.end();
  }
}

runSetup();
