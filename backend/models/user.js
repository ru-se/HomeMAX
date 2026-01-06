const supabase = require('../config/db');

module.exports = {
  // ユーザー作成
  createUser: async (id, email, username) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        user_id: id, // ここにSupabase AuthのUUIDが入る
        email,
        username,
        // passwordは保存しない！これでOK
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ... (他のメソッドは変更なしで動作します)

  // findById も user_id (UUID) で検索するため、SQLの型変更さえしていれば正常に動きます。
  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username, email, created_at, xp, level')
      .eq('user_id', id)
      .maybeSingle(); // 存在しない場合はnullを返す（エラーにしない）

    if (error) throw error;
    return data; // nullの場合もそのまま返す
  },

  // addXp も同様にOK
  addXp: async (userId, amount) => {
    // ... (省略。ロジック変更なし) ...
    // 前回のコードのままで大丈夫です
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('xp, level')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const newXp = currentXp + amount;
    const calculatedLevel = Math.floor(newXp / 50) + 1;

    const isLevelUp = calculatedLevel > currentLevel;
    const newLevel = isLevelUp ? calculatedLevel : currentLevel;

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ xp: newXp, level: newLevel })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      user: updatedUser,
      isLevelUp,
      xpGained: amount,
      previousLevel: currentLevel,
      currentLevel: newLevel
    };
  }
};
