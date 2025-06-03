const bcrypt = require("bcrypt");
const supabase = require("../config/db");

module.exports = {
  // サインアップ
  signup: async function (username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from("users")
        .insert([
          { username, email, password: hashedPassword }
        ]);

      if (error) {
        console.error(error);
        throw { message: "ユーザー登録に失敗しました" };
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  // ログイン
  login: async function (username, password) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single(); // 1件のみ取得

      if (error || !data) {
        console.log(error || "ユーザーが見つかりませんでした");
        throw { message: "該当するユーザーが見つかりませんでした" };
      }

      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        throw { message: "パスワードが間違っています" };
      }

      delete data.password; // パスワードは返さない
      return data;

    } catch (err) {
      console.log(err);
      throw { message: "ログイン中にエラーが発生しました" };
    }
  }
};
