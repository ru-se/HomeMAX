const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Optional auth middleware that doesn't fail if no token
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        await authMiddleware(req, res, (err) => {
            // If auth fails, continue anyway (req.user will be undefined)
            next();
        });
    } catch (error) {
        // If auth middleware throws, continue anyway
        next();
    }
};

// Get all achievements (with user status if authenticated)
router.get('/', optionalAuthMiddleware, achievementController.getAll);

// Get user's achievements (requires auth)
router.get('/user', authMiddleware, achievementController.getUserAchievements);

// Check and unlock achievements (requires auth)
router.post('/check', authMiddleware, achievementController.checkAchievements);

module.exports = router;
