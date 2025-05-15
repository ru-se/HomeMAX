const mysql = require("mysql2");

//MySQLとの繋ぎ合わせ
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});


//デバック用
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);


//繋がってるかのチェック
connection.connect((err) => {
    if (err) {
      console.log("エラー:"+ err);
      return;
    }
    console.log('success!');
  });

  module.exports = connection;