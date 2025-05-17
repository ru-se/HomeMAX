const complimentModel = require('../models/compliment');
const geminiService = require('../services/geminiService');

// 褒め言葉生成 & 保存 
exports.generateCompliment = async (req, res) => {
    try {
        //　　const user_id = req.session.user ? req.session.user.user_id : 1; 
        const { user_id, letter_id, letter_message } = req.body;

        if (!letter_id || !letter_message) {
            return res.status(400).json({ error: 'letter_id と letter_message が必要です' });
        }

        // Gemini APIで褒め言葉生成
        const prompt = `次の手紙に対して、ほめマックス口調でめちゃくちゃポジティブに褒めてください。絵文字もいっぱい使って。口癖はほめマックスで。そこまで長すぎないように。あなたはギャルです。：「${letter_message}」`;
        const complimentText = await geminiService.generateCompliment(prompt);

        // 褒める対象を抽出（例: キーワード解析）
        const positiveAspects = await geminiService.extractPositiveAspects(letter_message);

        // DB保存(後で実装)
        const happinessId = await complimentModel.saveCompliment({
             userId: user_id,
             letterId: letter_id,
             compliment: complimentText,
             positiveAspects
         });

        //res.json({ happiness_id: happinessId, compliment: complimentText, positive_aspects: positiveAspects });
        res.json({ compliment: complimentText, positive_aspects: positiveAspects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '褒め言葉生成エラー' });
    }
};

// 褒め言葉一覧取得
exports.getComplimentList = async (req, res) => {
    try {
        const userId = req.user ? req.user.user_id : 0;
        const compliments = await complimentModel.getComplimentList(userId);
        res.json(compliments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '褒め言葉一覧取得エラー' });
    }
};

// 手紙と褒め言葉の履歴取得
exports.getComplimentHistory = async (req, res) => {
    try {
        // クエリパラメータからuser_idを取得
        const userId = req.query.user_id || req.body.user_id || (req.user && req.user.user_id);
        if (!userId) {
            return res.status(400).json({ error: 'user_idが必要です' });
        }
        const history = await complimentModel.getComplimentHistory(userId);
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '履歴取得エラー' });
    }
};

// 日付指定で手紙と褒め言葉の履歴取得
exports.getComplimentHistoryByDate = async (req, res) => {
    try {
        const userId = req.query.user_id || req.body.user_id || (req.user && req.user.user_id);
        const date = req.query.date || req.body.date; // 追加

        if (!userId) {
            return res.status(400).json({ error: 'user_idが必要です' });
        }
        if (!date) {
            return res.status(400).json({ error: 'dateが必要です' });
        }
        const history = await complimentModel.getComplimentHistory(userId, date);
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '日付指定履歴取得エラー' });
    }
};
