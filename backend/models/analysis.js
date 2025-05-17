const pool = require("../config/db");

module.exports = {
    // 1日に送信された全お手紙の総数
    dailyLetterCount: function () {
        const query = `
            SELECT created_at::date as date, COUNT(*) as count
            FROM "Letters"
            WHERE created_at::date = CURRENT_DATE
            GROUP BY created_at::date
        `;
        return pool.query(query)
            .then(result => result.rows[0] || { date: null, count: 0 })
            .catch(err => {
                console.log(err);
                throw { err: "検索できませんでした" };
            });
    },

    // ポジティブ要素ごとの出現数（homemaxテーブルから集計）
    positiveAspectCounts: function () {
        const query = `
            SELECT positive_aspects, COUNT(*) as count
            FROM "homemax"
            GROUP BY positive_aspects
            ORDER BY count DESC
        `;
        return pool.query(query)
            .then(result => result.rows)
            .catch(err => {
                console.log(err);
                throw { err: "検索できませんでした" };
            });
    }
};
