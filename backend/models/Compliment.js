const pool = require('../config/db');

// 褒め言葉を保存
exports.saveCompliment = async ({ userId, letterId, compliment, positiveAspects }) => {
    const query = `
        INSERT INTO homemax (user_id, letter_id, compliment, positive_aspects, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING happiness_id
    `;
    const result = await pool.query(query, [userId, letterId, compliment, positiveAspects]);
    return result.rows[0]?.happiness_id;
};

// 褒め言葉一覧取得
exports.getComplimentList = async (userId) => {
    const query = `
        SELECT happiness_id, compliment, positive_aspects, created_at
        FROM homemax
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// 手紙と褒め言葉の履歴取得（日付指定なし）
exports.getComplimentHistory = async (userId) => {
    const query = `
        SELECT h.happiness_id, h.compliment, h.positive_aspects, h.created_at AS compliment_date,
               l.letter_id, l.message AS letter_message, l.created_at AS letter_date
        FROM homemax h
        JOIN Letters l ON h.letter_id = l.letter_id
        WHERE h.user_id = $1
        ORDER BY h.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// 日付指定で手紙と褒め言葉の履歴取得
exports.getComplimentHistoryByDate = async (userId, date) => {
    const query = `
        SELECT h.happiness_id, h.compliment, h.positive_aspects, h.created_at AS compliment_date,
               l.letter_id, l.message AS letter_message, l.created_at AS letter_date
        FROM homemax h
        JOIN Letters l ON h.letter_id = l.letter_id
        WHERE h.user_id = $1 AND h.created_at::date = $2
        ORDER BY h.created_at DESC
    `;
    const result = await pool.query(query, [userId, date]);
    return result.rows;
};