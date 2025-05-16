const db = require('../config/db');

// 褒め言葉を保存
exports.saveCompliment = async ({ userId, letterId, compliment, positiveAspects }) => {
    const query = `
        INSERT INTO homemax (user_id, letter_id, compliment, positive_aspects, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const result = await db.execute(query, [userId, letterId, compliment, positiveAspects]);
    console.log(result);
    return result.insertId;
};

// 褒め言葉一覧取得
exports.getComplimentList = async (userId) => {
    const query = `
        SELECT happiness_id, compliment, positive_aspects, created_at
        FROM homemax
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    const rows = await db.execute(query, [userId]);
    return rows;
};

// 手紙と褒め言葉の履歴取得
exports.getComplimentHistory = async (userId) => {
    const query = `
        SELECT 
            c.happiness_id,
            c.compliment,
            c.positive_aspects,
            c.created_at AS compliment_date,
            l.letter_id,
            l.message AS letter_message,
            l.created_at AS letter_date
        FROM homemax c
        INNER JOIN Letters l ON c.letter_id = l.letter_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;
    const rows = await db.execute(query, [userId]);
    return rows;
};
