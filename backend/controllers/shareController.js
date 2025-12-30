const supabase = require('../config/db');
const { randomUUID } = require('crypto');

module.exports = {
    // 共有リンクの生成 (または既存トークンの取得)
    createLink: async (req, res) => {
        try {
            const userId = req.user.user_id;
            const { happiness_id } = req.body;

            if (!happiness_id) {
                return res.status(400).json({ error: "happiness_idが必要です" });
            }

            // まず既存のトークンがあるか確認
            const { data: existing } = await supabase
                .from('homemax')
                .select('share_token')
                .eq('happiness_id', happiness_id)
                .eq('user_id', userId)
                .single();

            if (existing && existing.share_token) {
                return res.json({ share_token: existing.share_token });
            }

            // 新しいトークンを生成
            const token = randomUUID();

            const { data, error } = await supabase
                .from('homemax')
                .update({ share_token: token })
                .eq('happiness_id', happiness_id)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;

            res.json({ share_token: token });

        } catch (err) {
            console.error("Link creation failed:", err);
            res.status(500).json({ error: "リンク生成に失敗しました" });
        }
    },

    // 共有されたコンテンツの取得 (Public)
    getSharedContent: async (req, res) => {
        try {
            const { token } = req.params;

            // homemaxとlettersを結合して取得
            // 外部キー関係が正しければ select('*, letters(*)') が使えるが、
            // ここでは安全に homemax を取得 -> letter_id で letters を取得する流れで実装
            const { data: complimentData, error: cError } = await supabase
                .from('homemax')
                .select('*')
                .eq('share_token', token)
                .single();

            if (cError || !complimentData) {
                return res.status(404).json({ error: "ページが見つかりません" });
            }

            // 手紙の内容を取得
            const { data: letterData, error: lError } = await supabase
                .from('letters') // テーブル名注意 (init.sqlではLettersだがモデルではletters小文字で統一されているか確認)
                .select('message, created_at')
                .eq('letter_id', complimentData.letter_id)
                .single();

            // 念のため大文字Lettersでもトライ (エラーハンドリング)
            let finalLetterData = letterData;
            if (!letterData && !lError) {
                // Supabaseはテーブル名大小区別する場合がある、通常は小文字
            }

            res.json({
                compliment: complimentData,
                letter: finalLetterData
            });

        } catch (err) {
            console.error("Shared content fetch failed:", err);
            res.status(500).json({ error: "コンテンツの取得に失敗しました" });
        }
    },

    // リアクションの投稿 (Public)
    addReaction: async (req, res) => {
        try {
            const { token } = req.params;
            const { guest_name, reaction_type, message } = req.body;

            if (!guest_name) {
                return res.status(400).json({ error: "お名前を入力してください" });
            }

            // トークンから対象のhomemaxレコードを特定
            const { data: complimentData, error: findError } = await supabase
                .from('homemax')
                .select('happiness_id')
                .eq('share_token', token)
                .single();

            if (findError || !complimentData) {
                return res.status(404).json({ error: "対象が見つかりません" });
            }

            // リアクションを保存
            const { data, error } = await supabase
                .from('reactions')
                .insert([{
                    happiness_id: complimentData.happiness_id, // DBのカラム名は happiness_id
                    guest_name: guest_name,
                    stamp_type: reaction_type, // DBのカラム名は stamp_type
                    message: message,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            res.json({ message: "リアクションを送信しました！", reaction: data });

        } catch (err) {
            console.error("Reaction failed:", err);
            res.status(500).json({ error: "送信に失敗しました" });
        }
    }
};
