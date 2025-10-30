// サインアアップ、ログイン機能とか
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const Task = require("../models/task");

//サインアップ
module.exports = {
  signup: async function (req, res) {
    const { username, email, password } = req.body;
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ message: "必須項目が不足しています" });
      }
      const result = await User.signup(username, email, password);
      const userId = result.insertId;
      // const pool = require("../config/db");

      // タスク関連は一旦実装しない
      // await Task.createInitialTasks(userId);
      // await pool.query(taskQuery, initialTasks);

      return res
        .status(200)
        .json({ message: "登録成功！ログインしてください" });
    } catch (err) {
      console.log(err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "既に登録済みのユーザーです" });
      }
      return res.status(500).json({ message: "ユーザー登録に失敗しました" });
    }
  },

  // ログイン
  login: async function (req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.login(username, password);
      if (!user) {
        throw { message: "ユーザー名またはパスワードが正しくありません" };
      }

      const safeUser = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      };

      // JWT発行（7日で有効期限切れ）
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret || jwtSecret.length < 32) {
        console.error(
          "JWT_SECRET is missing or too short. Must be at least 32 characters."
        );
        return res.status(500).json({
          message: "JWTの設定に問題があります。管理者に連絡してください。",
        });
      }
      const token = jwt.sign(
        { id: safeUser.user_id, username: safeUser.username },
        jwtSecret,
        { expiresIn: "7d" }
      );

      // レスポンスにトークンを含める（必要なら set-cookie も可）
      return res.status(200).json({
        message: "ログイン成功",
        username: safeUser.username,
        token,
      });
    } catch (err) {
      console.log(err);
      // ユーザーが見つからない、パスワードが違う場合は401 Unauthorized
      if (
        err.message.includes("見つかりませんでした") ||
        err.message.includes("間違っています")
      ) {
        return res
          .status(401)
          .json({ message: "ユーザー名またはパスワードが正しくありません" });
      }
      res.status(500).json({ message: "認証処理中にエラーが発生しました" });
    }
  },

  getCurrentUser: function (req, res) {
    // if (!req.user) {
    //   return res.status(401).json({ message: "未認証です" });
    // }
    return res.status(200).json({ user: req.user });
  },

  //ログアウト
  logout: function (req, res) {
    // JWTの場合、クライアント側でトークンを削除するため、サーバー側では特に処理は不要
    return res.status(200).json({ message: "ログアウトしました" });
  },
};
