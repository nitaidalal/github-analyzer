import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:Number(process.env.DB_PORT),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
    waitForConnections: true,
    connectionLimit: 10,
});

export const initDB = async () => {
    try {
      const conn = await pool.getConnection();
      await conn.query(`
          CREATE TABLE IF NOT EXISTS profiles (
            id               INT AUTO_INCREMENT PRIMARY KEY,
            username         VARCHAR(100) UNIQUE NOT NULL,
            name             VARCHAR(200),
            bio              TEXT,
            avatar_url       VARCHAR(500),
            location         VARCHAR(200),
            blog             VARCHAR(500),
            company          VARCHAR(200),
            twitter_username VARCHAR(100),
            public_repos     INT DEFAULT 0,
            followers        INT DEFAULT 0,
            following        INT DEFAULT 0,
            total_stars      INT DEFAULT 0,
            total_forks      INT DEFAULT 0,
            top_languages    JSON,
            account_age_days INT DEFAULT 0,
            hireable         TINYINT(1),
            analyzed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      conn.release();
      console.log("✅ DB connected and table ready");
    } catch (err) {
      console.error("❌ DB init failed:", err.message);
      process.exit(1);
    }
};

export default pool;