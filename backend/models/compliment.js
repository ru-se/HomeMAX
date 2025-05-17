const db = require('../config/db');

// 褒め言葉を保存
exports.saveCompliment = async ({ userId, letterId, compliment, positiveAspects }) => {
    const query = `
        INSERT INTO homemax (user_id, letter_id, compliment, positive_aspects, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    try {
        const result = await db.execute(query, [userId, letterId, compliment, positiveAspects]);
        console.log('クエリ成功:', result);
        return result.insertId;
    } catch (error) {
        console.error('クエリ失敗:', error);
        throw error;
    }
};

// 褒め言葉一覧取得
exports.getComplimentList = async (userId) => {
    const query = `
        SELECT happiness_id, compliment, positive_aspects, created_at
        FROM homemax
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// 手紙と褒め言葉の履歴取得
exports.getComplimentHistory = async (userId) => {
    const query = `
        SELECT h.happiness_id, h.compliment, h.positive_aspects, h.created_at AS compliment_date,
               l.letter_id, l.message AS letter_message, l.created_at AS letter_date
        FROM homemax h
        JOIN Letters l ON h.letter_id = l.letter_id
        WHERE h.user_id = ?
        ORDER BY h.created_at DESC
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// 日付指定で手紙と褒め言葉の履歴取得
exports.getComplimentHistory = async (userId, date) => {
    let query = `
        SELECT h.happiness_id, h.compliment, h.positive_aspects, h.created_at AS compliment_date,
               l.letter_id, l.message AS letter_message, l.created_at AS letter_date
        FROM homemax h
        JOIN Letters l ON h.letter_id = l.letter_id
        WHERE h.user_id = ?
    `;
    const params = [userId];

    if (date) {
        // 日付部分だけで比較（時刻は無視）
        query += " AND DATE(h.created_at) = ?";
        params.push(date);
    }

    query += " ORDER BY h.created_at DESC";

    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};
