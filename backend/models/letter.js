// models/letter.js
const pool = require("../config/db"); // ★ 1. pool をインポート (connection ではない)

module.exports = {
  //送られたお手紙をDBに保存
  addLetter: async function (user_id, message) {
    // ★ 2. async
    const query = "INSERT INTO Letters(user_id, message) VALUES(?,?)";

    try {
      // ★ 3. new Promise... を削除し、try...catch と await pool.execute に変更
      const [result] = await pool.execute(query, [user_id, message]);
      console.log(result);
      return { insertId: result.insertId }; // これが 13行目あたり
    } catch (err) {
      console.log(err);
      throw { message: "メッセージを追加できませんでした" };
    }
  },

  //ユーザー名を指定して全てのLetterを返す
  allLetters: async function (user_id) {
    // ★ 2. async
    const query = "SELECT * FROM Letters WHERE user_id = ?";

    try {
      // ★ 3. try...catch と await pool.query
      const [result] = await pool.query(query, [user_id]);
      console.log(result);
      console.log("------------------");
      return result;
    } catch (err) {
      console.log(err);
      throw { message: "検索できませんでした" };
    }
  },

  //指定された日付のユーザーのLetterを返す
  selectLetters: async function (user_id, created_at) {
    // ★ 2. async
    const query =
      "SELECT * FROM Letters WHERE user_id = ? AND DATE(created_at) = ?";

    try {
      // ★ 3. try...catch と await pool.query
      const [result] = await pool.query(query, [user_id, created_at]);

      if (result.length === 0) {
        return null;
      } else {
        console.log(result);
        return result[0];
      }
    } catch (err) {
      console.log(err);
      throw { message: "検索できませんでした" };
    }
  },
};
