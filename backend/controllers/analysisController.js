const Analysis = require("../models/Analysis");

module.exports = {
    // 1日に送信された全お手紙の総数
    dailyLetterCount: async function (req, res) {
        try {
            const result = await Analysis.dailyLetterCount();
            res.status(200).json({ message: "本日のお手紙総数取得成功", result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },

    // ポジティブ要素ごとの出現数
    positiveAspectCounts: async function (req, res) {
        try {
            const result = await Analysis.positiveAspectCounts();
            res.status(200).json({ message: "ポジティブ要素ごとの数取得成功", result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
};