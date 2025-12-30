const supabase = require('../config/db');

module.exports = {
    // 褒め言葉を保存 (lettersテーブルと紐づけ)
    saveCompliment: async (userId, letterId, compliment, positiveAspects, title) => {
        // positiveAspects が配列の場合は文字列化、またはテキストそのまま保存
        const aspectsText = Array.isArray(positiveAspects) ? positiveAspects.join(', ') : positiveAspects;

        const { data, error } = await supabase
            .from('homemax')
            .insert([{
                user_id: userId,
                letter_id: letterId,
                compliment: compliment,
                positive_aspects: aspectsText,
                title: title, // DB定義に合わせてタイトルも保存
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 履歴取得 (lettersの情報も結合して取得したい場合)
    // SupabaseでのJoinは少し特殊ですが、基本は個別に取得するか、Viewを作るか、
    // あるいは foreign key 設定があれば select('*, letters(*)') のように書けます。
    // ここではシンプルに homemax テーブルを取得し、必要なら letter_id で letters を引く形にします
    // が、履歴ページで「手紙の内容」と「褒め言葉」両方出したいので、
    // ここでJoin的なクエリを書くのが理想です。

    // letters テーブルに mood カラムが無い場合は select から外す必要があります
    getComplimentHistory: async (userId, filters = {}) => {
        let query = supabase
            .from('homemax') // public.homemax
            .select(`
                *,
                letters (
                    message
                ),
                reactions (
                    reaction_id,
                    guest_name,
                    stamp_type,
                    message,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (filters.date) {
            // 日付検索: その日の 00:00:00 から 23:59:59 まで
            const startDate = new Date(filters.date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filters.date);
            endDate.setHours(23, 59, 59, 999);

            query = query.gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
};
