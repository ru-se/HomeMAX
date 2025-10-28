//MySQL接続
const pool = require("../config/db");

const bcrypt = require("bcrypt");

module.exports = {
  //サインアップ
  signup: async function (username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users(username, email, password) VALUES(?,?,?)";

    try {
      const [result] = await pool.execute(query, [
        username,
        email,
        hashedPassword,
      ]);
      console.log(result);
      return result;
    } catch (error) {
    //   console.log(error);
      throw error;
    }
  },

  //ログイン
  login: async function (username, password) {
    // DBへの登録確認
    const checkQuery = "SELECT * FROM users WHERE username = ? ";

    try {
      // ★ pool.execute でユーザーを検索
      const [results] = await pool.execute(checkQuery, [username]);

      if (results.length == 0) {
        console.log("ユーザーが見つからない");
        throw { message: "該当するユーザーが見つかりませんでした" };
      }

      const user = results[0];

      // ★ bcrypt.compare も await で待つ
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        console.log("ログイン成功");
        delete user.password;
        return user; // 成功したユーザー情報を返す
      } else {
        console.log("パスワードが違う");
        throw { message: "パスワードが間違っています" };
      }
    } catch (err) {
      console.log(err);
      // bcrypt のエラーもここでキャッチされる
      throw {
        message: "データベースまたはパスワード検証中にエラーが発生しました",
      };
    }
  },
};
