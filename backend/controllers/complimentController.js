const complimentModel = require('../models/compliment');
const geminiService = require('../services/geminiService');

// 褒め言葉生成 & 保存 
exports.generateCompliment = async (req, res) => {
    try {
        console.log("[DEBUG] Starting generateCompliment function"); // デバッグ開始ログ
        const { user_id, letter_id, letter_message, mode } = req.body;

        if (!letter_id || !letter_message) {
            return res.status(400).json({ error: 'letter_id と letter_message が必要です' });
        }

        // Gemini APIで褒め言葉生成
        const prompt = `# あなたへの指示：
                        あなたは「ほめマックス」という名前のキャラクターです。
                        以下の「ユーザーのメッセージ」を読んで、最高の褒め言葉を生成してください。
                        **等は使わないでください。
                        絵文字は少し多めでお願いします。

                        # 褒め言葉の条件：
                        * ユーザーの自己肯定感が上がるように、心からの称賛をたくさん伝えてください。
                        * 言われたユーザーが嬉しくなるような、ポジティブで温かい言葉を選んでください。
                        * あなたの口癖である「ほめマックス！」を、セリフのどこか（特に文末など）で自然に使ってください。
                        * 以下の「キャラクター設定」に完全になりきって話してください。

                        # キャラクター設定：
                        ${mode}

                        # ユーザーのメッセージ：
                        ${letter_message}

                        # 生成する褒め言葉：`;

        //console.log("[DEBUG] Generated prompt for Gemini API:", prompt); // 明確なログメッセージに変更
        const complimentText = await geminiService.generateCompliment(prompt);

        // 褒める対象を抽出（例: キーワード解析）
        const positiveAspects = await geminiService.extractPositiveAspects(letter_message);

        // タイトル生成
        const titleText = await geminiService.generateCompliment(`以下の文章を要約して、キャッチーなタイトルを5~10 文字で作ってください。タイトル以外の返信はしないでください。：「${complimentText}」`);

        //console.log("[DEBUG] Positive aspects extracted:", positiveAspects); // ポジティブ要素ログ

        // DB保存(後で実装)
        // const happinessId = await complimentModel.saveCompliment({
        //      userId: user_id,
        //      letterId: letter_id,
        //      compliment: complimentText,
        //      positiveAspects
        //  });
        //console.log("[DEBUG] Compliment saved with ID:", happinessId); // 保存ログ

        //res.json({ happiness_id: happinessId, compliment: complimentText, positive_aspects: positiveAspects });
        res.json({ title: titleText, compliment: complimentText, positive_aspects: positiveAspects  });
    } catch (err) {
        console.error("[ERROR] generateCompliment error:", err); // エラーログ
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
