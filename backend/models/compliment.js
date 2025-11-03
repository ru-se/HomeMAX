const supabase = require('../config/db');

module.exports = {
    // 褒め言葉を保存
    saveCompliment: async ({ userId, letterId, compliment, positiveAspects }) => {
        const { data, error } = await supabase
            .from('homemax')
            .insert([{
                user_id: userId,
                letter_id: letterId,
                compliment: compliment,
                positive_aspects: positiveAspects,
            }])
            .select('happiness_id') // insertIdの代替
            .single();

        if (error) {
            console.error('クエリ失敗:', error);
            throw error;
        }

        console.log('クエリ成功:', data);
        return data.happiness_id;
    },

    // 褒め言葉一覧取得
    getComplimentList: async (userId) => {
        const { data, error } = await supabase
            .from('homemax')
            .select('happiness_id, compliment, positive_aspects, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.log(error);
            throw error;
        }

        return data;
    },

    // 手紙と褒め言葉の履歴取得
    getComplimentHistory: async (userId, date = null) => {
        let query = supabase
            .from('homemax')
            .select(`
                happiness_id,
                compliment,
                positive_aspects,
                created_at as compliment_date,
                Letters (
                    letter_id,
                    message,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (date) {
            query = query.gte('created_at', `${date}T00:00:00`).lt('created_at', `${date}T23:59:59`);
        }

        const { data, error } = await query;

        if (error) {
            console.log(error);
            throw error;
        }

        // フィールド名を元の仕様に揃える（オプション）
        const formatted = data.map(item => ({
            happiness_id: item.happiness_id,
            compliment: item.compliment,
            positive_aspects: item.positive_aspects,
            compliment_date: item.compliment_date,
            letter_id: item.Letters?.letter_id,
            letter_message: item.Letters?.message,
            letter_date: item.Letters?.created_at,
        }));

        return formatted;
    }
};
