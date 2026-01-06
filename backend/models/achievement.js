const supabase = require('../config/db');

module.exports = {
    // Get all achievements
    getAllAchievements: async () => {
        const { data, error } = await supabase
            .from('achievement_master')
            .select('*')
            .order('achievement_id', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Get user's unlocked achievements
    getUserAchievements: async (userId) => {
        const { data, error } = await supabase
            .from('user_achievements')
            .select(`
        *,
        achievement_master (*)
      `)
            .eq('user_id', userId)
            .order('unlocked_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get all achievements with user's unlock status
    getAllWithUserStatus: async (userId) => {
        const allAchievements = await module.exports.getAllAchievements();
        const userAchievements = await module.exports.getUserAchievements(userId);

        const userAchievementIds = userAchievements.map(ua => ua.achievement_id);

        return allAchievements.map(achievement => ({
            ...achievement,
            unlocked: userAchievementIds.includes(achievement.achievement_id),
            unlocked_at: userAchievements.find(ua => ua.achievement_id === achievement.achievement_id)?.unlocked_at
        }));
    },

    // Unlock achievement for user
    unlockAchievement: async (userId, achievementId) => {
        const { data, error } = await supabase
            .from('user_achievements')
            .insert([{ user_id: userId, achievement_id: achievementId }])
            .select(`
        *,
        achievement_master (*)
      `)
            .single();

        if (error) {
            // Already unlocked (unique constraint violation)
            if (error.code === '23505') {
                return null;
            }
            throw error;
        }
        return data;
    },

    // Check and unlock achievements based on user stats
    checkAndUnlockAchievements: async (userId) => {
        console.log('[ACHIEVEMENT MODEL] Starting check for user:', userId);
        const newlyUnlocked = [];

        // Get user stats
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('level')
            .eq('user_id', userId)
            .single();
        console.log('[ACHIEVEMENT MODEL] User data:', user, 'Error:', userError);

        const { data: letters, error: letterError, count: letterCount } = await supabase
            .from('letters')
            .select('letter_id', { count: 'exact' })
            .eq('user_id', userId);
        console.log('[ACHIEVEMENT MODEL] Letters:', letterCount, 'Error:', letterError);

        const { data: tasks, error: taskError, count: taskCount } = await supabase
            .from('tasks')
            .select('task_id', { count: 'exact' })
            .eq('user_id', userId)
            .eq('is_completed', true);
        console.log('[ACHIEVEMENT MODEL] Tasks:', taskCount, 'Error:', taskError);

        // Get all achievements
        const allAchievements = await module.exports.getAllAchievements();
        console.log('[ACHIEVEMENT MODEL] Total achievements:', allAchievements.length);

        // Check each achievement
        for (const achievement of allAchievements) {
            let shouldUnlock = false;

            switch (achievement.condition_type) {
                case 'signup':
                    shouldUnlock = true; // Always unlock signup achievement
                    console.log('[ACHIEVEMENT MODEL] Signup achievement - should unlock');
                    break;
                case 'level':
                    shouldUnlock = user && user.level >= achievement.condition_value;
                    console.log(`[ACHIEVEMENT MODEL] Level check: ${user?.level} >= ${achievement.condition_value} = ${shouldUnlock}`);
                    break;
                case 'letter_count':
                    shouldUnlock = letterCount !== null && letterCount >= achievement.condition_value;
                    console.log(`[ACHIEVEMENT MODEL] Letter check: ${letterCount} >= ${achievement.condition_value} = ${shouldUnlock}`);
                    break;
                case 'task_count':
                    shouldUnlock = taskCount !== null && taskCount >= achievement.condition_value;
                    console.log(`[ACHIEVEMENT MODEL] Task check: ${taskCount} >= ${achievement.condition_value} = ${shouldUnlock}`);
                    break;
            }

            if (shouldUnlock) {
                console.log('[ACHIEVEMENT MODEL] Attempting to unlock:', achievement.achievement_name);
                const unlocked = await module.exports.unlockAchievement(userId, achievement.achievement_id);
                if (unlocked) {
                    console.log('[ACHIEVEMENT MODEL] Successfully unlocked:', achievement.achievement_name);
                    newlyUnlocked.push(unlocked);
                } else {
                    console.log('[ACHIEVEMENT MODEL] Already unlocked or failed:', achievement.achievement_name);
                }
            }
        }

        console.log('[ACHIEVEMENT MODEL] Total newly unlocked:', newlyUnlocked.length);
        return newlyUnlocked;
    }
};
