const complimentModel = require('../models/compliment');
const geminiService = require('../services/geminiService');

// 褒め言葉生成 & 保存 
exports.generateCompliment = async (req, res) => {
    try {
        console.log("[DEBUG] Starting generateCompliment function");
        const { user_id, letter_id, letter_message, mode } = req.body;

        if (!letter_id || !letter_message) {
            return res.status(400).json({ error: 'letter_id と letter_message が必要です' });
        }

        // 過去の成長を取得
        const pastCompliments = await complimentModel.getComplimentHistory(user_id);
        const growthContext = pastCompliments.length > 0 
            ? `過去にこんなことを褒めました: ${pastCompliments.slice(0, 3).map(c => c.positive_aspects).join('、')}` 
            : '';

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
                        * 文章は200文字以内で簡潔に、でも心を込めて。

                        ${growthContext ? `# 成長の記録：\n${growthContext}\n上記と比較して成長している点があれば、それも褒めてください。` : ''}

                        # キャラクター設定：
                        ${mode}

                        # ユーザーのメッセージ：
                        ${letter_message}

                        # 生成する褒め言葉：`;

        const complimentText = await geminiService.generateCompliment(prompt);

        // 褒める対象を抽出
        const positiveAspects = await geminiService.extractPositiveAspects(letter_message);

        // DB保存
        const happinessId = await complimentModel.saveCompliment({
            userId: user_id,
            letterId: letter_id,
            compliment: complimentText,
            positiveAspects
        });

        res.json({ 
            happiness_id: happinessId, 
            compliment: complimentText, 
            positive_aspects: positiveAspects 
        });
    } catch (err) {
        console.error("[ERROR] generateCompliment error:", err);
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
        const date = req.query.date || req.body.date;

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

// 統計情報取得（AIとの差別化）
exports.getStats = async (req, res) => {
    try {
        const userId = req.query.user_id || (req.user && req.user.user_id);
        if (!userId) {
            return res.status(400).json({ error: 'user_idが必要です' });
        }

        const history = await complimentModel.getComplimentHistory(userId);
        
        // カテゴリ別の集計
        const categoryCount = {};
        history.forEach(item => {
            if (item.positive_aspects) {
                const aspects = item.positive_aspects.split('、');
                aspects.forEach(aspect => {
                    categoryCount[aspect] = (categoryCount[aspect] || 0) + 1;
                });
            }
        });

        // 成長の分析
        const recentCompliments = history.slice(0, 10);
        const oldCompliments = history.slice(10, 20);
        
        res.json({
            totalCompliments: history.length,
            categoryCount,
            recentCategories: recentCompliments.map(c => c.positive_aspects),
            growth: {
                recent: recentCompliments.length,
                old: oldCompliments.length
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '統計情報取得エラー' });
    }
};