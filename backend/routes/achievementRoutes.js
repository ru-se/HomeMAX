const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');
const supabase = require('../config/db');

// Optional auth middleware that doesn't fail if no token
const optionalAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
            user.user_id = user.id;
            req.user = user;
        }
    } catch (err) {
        // If error, ignore and proceed as guest
        console.log("Optional auth check failed:", err);
    }
    next();
};

// Get all achievements (with user status if authenticated)
router.get('/', optionalAuthMiddleware, achievementController.getAll);

// Get user's achievements (requires auth)
router.get('/user', authMiddleware, achievementController.getUserAchievements);

// Check and unlock achievements (requires auth)
router.post('/check', authMiddleware, achievementController.checkAchievements);

module.exports = router;
