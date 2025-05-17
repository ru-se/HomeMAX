const pool = require("../config/db");

module.exports = {
    // 送られたお手紙をDBに保存
    addLetter: async function (user_id, message) {
        const query = `
            INSERT INTO "letters"(user_id, message)
            VALUES ($1, $2)
            RETURNING letter_id
        `;
        try {
            const result = await pool.query(query, [user_id, message]);
            return { insertId: result.rows[0].letter_id };
        } catch (err) {
            console.log(err);
            throw { message: "メッセージを追加できませんでした" };
        }
    },

    // ユーザーIDを指定して全てのLetterを返す
    allLetters: async function (user_id) {
        const query = `
            SELECT * FROM "letters"
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        try {
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw { message: "検索できませんでした" };
        }
    },

    // 指定された日付のユーザーのLetterを返す
    selectLetters: async function (user_id, created_at) {
        const query = `
            SELECT * FROM "letters"
            WHERE user_id = $1 AND created_at::date = $2
            ORDER BY created_at DESC
        `;
        try {
            const result = await pool.query(query, [user_id, created_at]);
            if (result.rows.length === 0) {
                return null;
            } else {
                return result.rows[0];
            }
        } catch (err) {
            console.log(err);
            throw { message: "検索できませんでした" };
        }
    }
}
