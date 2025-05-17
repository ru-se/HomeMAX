const connection = require("../config/db");

module.exports = {
    // 1日に送信された全お手紙の総数
    dailyLetterCount: function () {
        const query = `
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM Letters
            WHERE DATE(created_at) = CURDATE()
            GROUP BY DATE(created_at)
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    reject({ err: "検索できませんでした" });
                } else {
                    resolve(result[0] || { date: null, count: 0 });
                }
            });
        });
    },

    // ポジティブ要素ごとの出現数（homemaxテーブルから集計）
    positiveAspectCounts: function () {
        const query = `
            SELECT positive_aspects, COUNT(*) as count
            FROM homemax
            GROUP BY positive_aspects
            ORDER BY count DESC
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    reject({ err: "検索できませんでした" });
                } else {
                    resolve(result);
                }
            });
        });
    }
};
