const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,      // Supabaseのホスト
    user: process.env.DB_USER,      // Supabaseのユーザー
    password: process.env.DB_PASS,  // Supabaseのパスワード
    database: process.env.DB_NAME,  // SupabaseのDB名
    port: process.env.DB_PORT || 5432, // Supabaseは通常5432
    ssl: { rejectUnauthorized: false } // SupabaseはSSL必須
});

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);

module.exports = pool;