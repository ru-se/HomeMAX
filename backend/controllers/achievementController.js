const achievementModel = require('../models/achievement');

// Get all achievements with user unlock status
exports.getAll = async (req, res) => {
    console.log('[ACHIEVEMENT GET ALL] Function called');
    console.log('[ACHIEVEMENT GET ALL] req.user:', req.user);
    try {
        const userId = req.user?.id;
        console.log('[ACHIEVEMENT GET ALL] User ID:', userId);

        if (userId) {
            console.log('[ACHIEVEMENT GET ALL] Calling getAllWithUserStatus');
            const achievements = await achievementModel.getAllWithUserStatus(userId);
            res.json({ achievements });
        } else {
            console.log('[ACHIEVEMENT GET ALL] No user, calling getAllAchievements');
            const achievements = await achievementModel.getAllAchievements();
            res.json({ achievements });
        }
    } catch (err) {
        console.error("[ACHIEVEMENT GET ALL] Error:", err);
        res.status(500).json({ error: '称号の取得に失敗しました' });
    }
};

// Get user's unlocked achievements
exports.getUserAchievements = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: '認証が必要です' });
        }

        const achievements = await achievementModel.getUserAchievements(userId);
        res.json({ achievements });
    } catch (err) {
        console.error("Get User Achievements Error:", err);
        res.status(500).json({ error: '称号の取得に失敗しました' });
    }
};

// Check and unlock achievements (called after task/letter completion)
exports.checkAchievements = async (req, res) => {
    console.log('[ACHIEVEMENT CHECK] Function called');
    try {
        const userId = req.user?.id;
        console.log('[ACHIEVEMENT CHECK] User ID:', userId);

        if (!userId) {
            console.log('[ACHIEVEMENT CHECK] No user ID found!');
            return res.status(401).json({ error: '認証が必要です' });
        }

        console.log('[ACHIEVEMENT CHECK] Calling checkAndUnlockAchievements');
        const newlyUnlocked = await achievementModel.checkAndUnlockAchievements(userId);
        console.log('[ACHIEVEMENT CHECK] Result:', newlyUnlocked.length, 'achievements');

        res.json({
            message: `${newlyUnlocked.length}個の新しい称号を獲得しました`,
            achievements: newlyUnlocked
        });
    } catch (err) {
        console.error("[ACHIEVEMENT CHECK] Error:", err);
        res.status(500).json({ error: '称号チェックに失敗しました', details: err.message });
    }
};
