const mysql = require("mysql2/promise");

//MySQLとの繋ぎ合わせ
// ★ createConnection から createPool に変更
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//デバック用
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);

// ★ 接続プールができたことを確認
console.log("MySQL Connection Pool created successfully!");
module.exports = pool;
