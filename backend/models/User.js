const pool = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
    // サインアップ
    signup: async function (username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
        try {
            const result = await pool.query(query, [username, email, hashedPassword]);
            return result.rows[0];
        } catch (err) {
            console.log(err);
            throw { message: "ユーザー登録に失敗しました" };
        }
    },

    // ログイン
    login: async function (username, password) {
        const checkQuery = 'SELECT * FROM users WHERE username = $1';
        try {
            const result = await pool.query(checkQuery, [username]);
            if (result.rows.length === 0) {
                console.log("ユーザーが見つからない");
                throw { message: "該当するユーザーが見つかりませんでした" };
            }
            const user = result.rows[0];
            const checkPassword = await bcrypt.compare(password, user.password);
            if (checkPassword) {
                console.log("ログイン成功");
                delete user.password;
                return user;
            } else {
                console.log("パスワードが違う");
                throw { message: "パスワードが間違っています" };
            }
        } catch (err) {
            console.log(err);
            throw { message: err.message || "データベース確認中にエラーが発生しました" };
        }
    }
};