const supabase = require("../config/db");

module.exports = {
    // お手紙をDBに保存
    addLetter: async function (user_id, message) {
        const { data, error } = await supabase
            .from('letters')
            .insert([{ user_id, message }])
            .select('letter_id')  // insertId を代替
            .single();

        if (error) {
            console.log(error);
            throw { message: "メッセージを追加できませんでした" };
        }

        return { insertId: data.letter_id };
    },

    // 指定ユーザーの全てのLetterを取得
    allLetters: async function (user_id) {
        const { data, error } = await supabase
            .from('letters')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            console.log(error);
            throw { message: "検索できませんでした" };
        }

        console.log(data);
        console.log("------------------");
        return data;
    },

    // 指定日付のLetterを取得（1件目）
    selectLetters: async function (user_id, created_at) {
        const { data, error } = await supabase
            .from('letters')
            .select('*')
            .eq('user_id', user_id)
            .eq('created_at', created_at) // created_at に時間が含まれていると一致しない場合あり
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.log(error);
            throw { message: "検索できませんでした" };
        }

        return data || null;
    }
};
